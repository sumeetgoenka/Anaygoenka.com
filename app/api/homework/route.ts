import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Homework } from '@/types';

// Comprehensive homework database for all year groups
const demoHomework = [
  // Year 7 Assignments
  {
    id: 'y7-math-1',
    title: 'Basic Algebra - Solving Simple Equations',
    subject: 'Mathematics',
    description: 'Complete exercises 1-15 in Chapter 3. Practice solving linear equations with one variable. Show all working steps.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-15',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-math-2',
    title: 'Fractions and Decimals',
    subject: 'Mathematics',
    description: 'Complete worksheet on adding, subtracting, multiplying and dividing fractions. Convert between fractions and decimals.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-22',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-english-1',
    title: 'Creative Writing - Short Story',
    subject: 'English',
    description: 'Write a 500-word short story with a clear beginning, middle, and end. Include dialogue and descriptive language.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-18',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-english-2',
    title: 'Poetry Analysis - "The Highwayman"',
    subject: 'English',
    description: 'Analyze Alfred Noyes\' poem "The Highwayman". Identify poetic devices, themes, and write a 300-word response.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-25',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-science-1',
    title: 'Cells and Microscopes',
    subject: 'Science',
    description: 'Complete lab report on observing plant and animal cells under microscope. Draw labeled diagrams and explain differences.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-20',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-science-2',
    title: 'Forces and Motion',
    subject: 'Science',
    description: 'Complete practical investigation on forces. Measure and record data, create graphs, and write conclusions.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-27',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-history-1',
    title: 'Medieval England Research',
    subject: 'History',
    description: 'Research project on life in medieval England. Create a poster or presentation covering daily life, social structure, and key events.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-30',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y7-geography-1',
    title: 'Map Skills and Atlas Work',
    subject: 'Geography',
    description: 'Complete atlas exercises on world geography. Practice using grid references, scale, and identifying countries and capitals.',
    yearGroup: 'Year 7',
    dueDate: '2024-01-17',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },

  // Year 8 Assignments
  {
    id: 'y8-math-1',
    title: 'Linear Equations and Inequalities',
    subject: 'Mathematics',
    description: 'Solve linear equations and inequalities. Complete exercises 1-25 including word problems and graphical solutions.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-16',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-math-2',
    title: 'Pythagoras\' Theorem',
    subject: 'Mathematics',
    description: 'Practice using Pythagoras\' theorem to find missing sides in right-angled triangles. Complete worksheet with real-world applications.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-23',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-english-1',
    title: 'Shakespeare - "A Midsummer Night\'s Dream"',
    subject: 'English',
    description: 'Read Act 1 and 2 of "A Midsummer Night\'s Dream". Write character analysis of Puck and explain the plot structure.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-19',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-english-2',
    title: 'Persuasive Writing - Speech',
    subject: 'English',
    description: 'Write a persuasive speech on a topic of your choice. Include rhetorical devices, evidence, and a strong conclusion.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-26',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-science-1',
    title: 'Chemical Reactions',
    subject: 'Science',
    description: 'Complete lab report on chemical reactions. Observe and record changes, identify reactants and products, write balanced equations.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-21',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-science-2',
    title: 'Electricity and Circuits',
    subject: 'Science',
    description: 'Build and test electrical circuits. Measure voltage and current, create circuit diagrams, and explain how components work.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-28',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-history-1',
    title: 'Tudor England - Henry VIII',
    subject: 'History',
    description: 'Research project on Henry VIII and the English Reformation. Create timeline of key events and explain their significance.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-31',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y8-geography-1',
    title: 'Weather and Climate',
    subject: 'Geography',
    description: 'Complete weather diary for one week. Record temperature, precipitation, wind direction. Analyze patterns and create weather map.',
    yearGroup: 'Year 8',
    dueDate: '2024-01-24',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },

  // Year 9 Assignments
  {
    id: 'y9-math-1',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    description: 'Solve quadratic equations by factoring, completing the square, and using the quadratic formula. Complete exercises 1-30.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-17',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-math-2',
    title: 'Trigonometry - Sine and Cosine',
    subject: 'Mathematics',
    description: 'Learn sine and cosine ratios. Solve problems involving right-angled triangles. Complete worksheet with real-world applications.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-24',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-english-1',
    title: 'Shakespeare - "Romeo and Juliet"',
    subject: 'English',
    description: 'Read Act 1-3 of "Romeo and Juliet". Analyze the themes of love and conflict. Write essay on character development.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-20',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-english-2',
    title: 'Creative Writing - Gothic Fiction',
    subject: 'English',
    description: 'Write a gothic short story (800 words) using atmospheric description, suspense, and supernatural elements.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-27',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-science-1',
    title: 'Genetics and Inheritance',
    subject: 'Science',
    description: 'Complete Punnett square problems. Study inheritance patterns and genetic disorders. Write report on genetic engineering.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-22',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-science-2',
    title: 'Chemical Bonding',
    subject: 'Science',
    description: 'Study ionic and covalent bonding. Create models of molecules, explain bonding types, and complete worksheet.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-29',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-history-1',
    title: 'World War I - Causes and Events',
    subject: 'History',
    description: 'Research the causes and early events of WWI. Create timeline and write essay on the role of alliances.',
    yearGroup: 'Year 9',
    dueDate: '2024-02-01',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y9-geography-1',
    title: 'Population and Migration',
    subject: 'Geography',
    description: 'Study population pyramids, migration patterns, and demographic transition. Complete case study on a specific country.',
    yearGroup: 'Year 9',
    dueDate: '2024-01-25',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },

  // Year 10 Assignments
  {
    id: 'y10-math-1',
    title: 'Advanced Algebra - Functions',
    subject: 'Mathematics',
    description: 'Study linear, quadratic, and cubic functions. Graph functions, find roots, and analyze transformations.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-18',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-math-2',
    title: 'Statistics and Probability',
    subject: 'Mathematics',
    description: 'Complete statistical analysis project. Collect data, create graphs, calculate measures of central tendency and probability.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-25',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-english-1',
    title: 'Shakespeare - "Macbeth"',
    subject: 'English',
    description: 'Read "Macbeth" Acts 1-3. Analyze themes of ambition and power. Write essay on Lady Macbeth\'s character.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-21',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-english-2',
    title: 'Modern Literature - "Of Mice and Men"',
    subject: 'English',
    description: 'Read John Steinbeck\'s "Of Mice and Men". Analyze themes of friendship, dreams, and the American Dream.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-28',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-science-1',
    title: 'Organic Chemistry',
    subject: 'Science',
    description: 'Study hydrocarbons, alcohols, and carboxylic acids. Complete practical on organic compounds and write lab report.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-23',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-science-2',
    title: 'Physics - Forces and Motion',
    subject: 'Science',
    description: 'Study Newton\'s laws, momentum, and energy. Complete practical investigations and solve complex problems.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-30',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-history-1',
    title: 'World War II - Global Conflict',
    subject: 'History',
    description: 'Research WWII from global perspective. Study key battles, leaders, and impact on different countries.',
    yearGroup: 'Year 10',
    dueDate: '2024-02-02',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y10-geography-1',
    title: 'Natural Hazards and Disasters',
    subject: 'Geography',
    description: 'Study earthquakes, volcanoes, hurricanes, and tsunamis. Complete case study on a recent natural disaster.',
    yearGroup: 'Year 10',
    dueDate: '2024-01-26',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },

  // Year 11 Assignments
  {
    id: 'y11-math-1',
    title: 'Calculus - Differentiation',
    subject: 'Mathematics',
    description: 'Learn basic differentiation rules. Find derivatives of polynomials, trigonometric functions, and apply to real problems.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-19',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-math-2',
    title: 'Advanced Trigonometry',
    subject: 'Mathematics',
    description: 'Study sine and cosine rules, area of triangles, and trigonometric identities. Solve complex problems.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-26',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-english-1',
    title: 'Shakespeare - "Hamlet"',
    subject: 'English',
    description: 'Read "Hamlet" Acts 1-3. Analyze themes of revenge, madness, and mortality. Write essay on Hamlet\'s soliloquies.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-22',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-english-2',
    title: 'Poetry Analysis - Modern Poets',
    subject: 'English',
    description: 'Analyze poems by modern poets (Hughes, Plath, Heaney). Compare themes, styles, and poetic techniques.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-29',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-science-1',
    title: 'Advanced Chemistry - Equilibrium',
    subject: 'Science',
    description: 'Study chemical equilibrium, Le Chatelier\'s principle, and equilibrium constants. Complete practical investigations.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-24',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-science-2',
    title: 'Biology - Respiration and Photosynthesis',
    subject: 'Science',
    description: 'Study cellular respiration and photosynthesis. Complete practical on gas exchange and write detailed lab report.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-31',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-history-1',
    title: 'Cold War - Superpower Relations',
    subject: 'History',
    description: 'Research Cold War from 1945-1991. Study key events, leaders, and impact on international relations.',
    yearGroup: 'Year 11',
    dueDate: '2024-02-03',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
  {
    id: 'y11-geography-1',
    title: 'Global Development and Inequality',
    subject: 'Geography',
    description: 'Study development indicators, causes of inequality, and strategies for sustainable development.',
    yearGroup: 'Year 11',
    dueDate: '2024-01-27',
    isLive: true,
    liveDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'admin-1',
  },
];

// GET - Fetch homework (public or user-specific)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const yearGroup = searchParams.get('yearGroup');
    const userId = searchParams.get('userId');

    let homework = [...demoHomework];

    // Filter by subject if specified
    if (subject) {
      homework = homework.filter(hw => hw.subject === subject);
    }

    // Filter by year group if specified
    if (yearGroup) {
      homework = homework.filter(hw => hw.yearGroup === yearGroup);
    }

    // Sort by due date (string comparison works for YYYY-MM-DD format)
    homework.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    // Add completion status for demo purposes
    if (session?.user?.id && userId) {
      homework.forEach((hw) => {
        (hw as any).completed = Math.random() > 0.7; // Random completion for demo
      });
    }

    return NextResponse.json(homework);
  } catch (error) {
    console.error('Error fetching homework:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homework' },
      { status: 500 }
    );
  }
}

// POST - Create new homework (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, subject, description, yearGroup, dueDate, isLive, liveDate } = body;

    // For demo purposes, just return success
    const newHomework = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      yearGroup,
      dueDate: dueDate,
      isLive: isLive || false,
      liveDate: liveDate || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: session.user.id,
    };
    
    return NextResponse.json(newHomework);
  } catch (error) {
    console.error('Error creating homework:', error);
    return NextResponse.json(
      { error: 'Failed to create homework' },
      { status: 500 }
    );
  }
} 