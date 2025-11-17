import prisma from '../config/database';
import axios from 'axios';

export class AIService {
  private openaiApiKey: string;
  private openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  // Generate AI feedback for assignment submission
  async generateAssignmentFeedback(
    assignmentTitle: string,
    assignmentDescription: string,
    submissionContent: string,
    grade?: number
  ): Promise<string> {
    if (!this.openaiApiKey) {
      return this.generateFallbackFeedback(grade);
    }

    try {
      const prompt = `You are an experienced coding instructor. Review this student's assignment submission and provide constructive feedback.

Assignment: ${assignmentTitle}
Description: ${assignmentDescription}
${grade !== undefined ? `Grade: ${grade}/100` : ''}

Submission Content:
${submissionContent.substring(0, 2000)}

Provide:
1. What the student did well
2. Areas for improvement
3. Specific suggestions for next steps
4. Encouragement

Keep feedback concise (max 200 words) and constructive.`;

      const response = await axios.post(
        this.openaiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful coding instructor providing constructive feedback.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI feedback generation error:', error);
      return this.generateFallbackFeedback(grade);
    }
  }

  private generateFallbackFeedback(grade?: number): string {
    if (grade === undefined) {
      return 'Your submission has been received and is under review. Keep up the good work!';
    }

    if (grade >= 90) {
      return 'Excellent work! Your submission demonstrates strong understanding of the concepts. Keep up the outstanding effort!';
    } else if (grade >= 80) {
      return 'Great job! Your submission shows good grasp of the material. Consider reviewing the feedback for areas to refine further.';
    } else if (grade >= 70) {
      return 'Good effort! You\'re on the right track. Focus on the areas mentioned in the feedback to strengthen your understanding.';
    } else if (grade >= 60) {
      return 'You\'re making progress. Review the concepts covered and don\'t hesitate to ask questions in the forum or reach out for help.';
    } else {
      return 'This assignment needs more work. Please review the material carefully and consider attending office hours for additional support.';
    }
  }

  // Generate personalized study recommendations
  async generateStudyRecommendations(userId: string): Promise<string[]> {
    const [submissions, attendance, forumActivity] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        include: { assignment: true },
        orderBy: { submittedAt: 'desc' },
        take: 10
      }),
      prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      }),
      prisma.forumPost.count({ where: { userId } })
    ]);

    const recommendations: string[] = [];

    // Analyze grades
    const recentGrades = submissions.filter(s => s.grade !== null).map(s => s.grade!);
    if (recentGrades.length > 0) {
      const avgGrade = recentGrades.reduce((a, b) => a + b, 0) / recentGrades.length;
      
      if (avgGrade < 70) {
        recommendations.push('📚 Consider scheduling study sessions to review challenging concepts');
        recommendations.push('👥 Join study groups or attend office hours for additional support');
      } else if (avgGrade >= 90) {
        recommendations.push('🌟 Excellent performance! Consider helping peers in the forum');
        recommendations.push('🚀 Challenge yourself with advanced topics or side projects');
      }
    }

    // Analyze submission patterns
    const lateSubmissions = submissions.filter(s => 
      new Date(s.submittedAt) > new Date(s.assignment.dueDate)
    );
    if (lateSubmissions.length > submissions.length * 0.3) {
      recommendations.push('⏰ Work on time management - try breaking assignments into smaller tasks');
      recommendations.push('📅 Set personal deadlines 2-3 days before actual due dates');
    }

    // Analyze attendance
    const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
    const attendanceRate = attendance.length > 0 ? presentCount / attendance.length : 0;
    
    if (attendanceRate < 0.8) {
      recommendations.push('📍 Regular attendance is key to success - try not to miss sessions');
    }

    // Forum engagement
    if (forumActivity < 3) {
      recommendations.push('💬 Engage more in the forum - asking and answering questions reinforces learning');
    }

    // Default recommendations if none generated
    if (recommendations.length === 0) {
      recommendations.push('✅ Keep up the great work! Stay consistent with your studies');
      recommendations.push('🎯 Set specific learning goals for each week');
      recommendations.push('🔄 Review previous assignments to reinforce concepts');
    }

    return recommendations.slice(0, 5); // Return max 5 recommendations
  }

  // Analyze code submission (basic static analysis)
  async analyzeCodeSubmission(code: string, language: string): Promise<{
    complexity: 'low' | 'medium' | 'high';
    suggestions: string[];
    strengths: string[];
  }> {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const codeLength = lines.length;

    const suggestions: string[] = [];
    const strengths: string[] = [];

    // Basic code analysis
    if (codeLength < 10) {
      suggestions.push('Consider adding more comprehensive implementation');
    } else if (codeLength > 200) {
      suggestions.push('Consider breaking down into smaller, reusable functions');
    } else {
      strengths.push('Good code length and structure');
    }

    // Check for comments
    const commentLines = lines.filter(line => 
      line.trim().startsWith('//') || 
      line.trim().startsWith('/*') || 
      line.trim().startsWith('*') ||
      line.trim().startsWith('#')
    );
    
    if (commentLines.length / lines.length > 0.1) {
      strengths.push('Well-documented code with helpful comments');
    } else if (commentLines.length === 0) {
      suggestions.push('Add comments to explain complex logic');
    }

    // Check for functions/methods
    const functionPattern = /function\s+\w+|const\s+\w+\s*=\s*\(|def\s+\w+|public\s+\w+\s+\w+\(/g;
    const functionCount = (code.match(functionPattern) || []).length;
    
    if (functionCount > 0) {
      strengths.push('Good use of functions for code organization');
    }

    // Determine complexity
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (codeLength > 100 || functionCount > 5) {
      complexity = 'high';
    } else if (codeLength > 50 || functionCount > 2) {
      complexity = 'medium';
    }

    return { complexity, suggestions, strengths };
  }

  // Generate quiz questions based on assignment
  async generateQuizQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<any[]> {
    if (!this.openaiApiKey) {
      return this.generateFallbackQuiz(topic);
    }

    try {
      const prompt = `Generate 3 multiple-choice questions about ${topic} at ${difficulty} difficulty level.
Format as JSON array with structure:
[{
  "question": "question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why this is correct"
}]`;

      const response = await axios.post(
        this.openaiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a quiz generator. Return only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Quiz generation error:', error);
      return this.generateFallbackQuiz(topic);
    }
  }

  private generateFallbackQuiz(topic: string): any[] {
    return [
      {
        question: `What is a key concept in ${topic}?`,
        options: [
          'Understanding the fundamentals',
          'Ignoring best practices',
          'Skipping documentation',
          'Avoiding testing'
        ],
        correctAnswer: 0,
        explanation: 'Understanding fundamentals is crucial for mastering any topic.'
      }
    ];
  }
}
