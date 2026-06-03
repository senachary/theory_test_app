export type AnswerOption = {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
};

export type Category =
  | 'Alertness'
  | 'Attitude'
  | 'Safety and Your Vehicle'
  | 'Safety Margins'
  | 'Hazard Awareness'
  | 'Vulnerable Road Users'
  | 'Other Types of Vehicle'
  | 'Vehicle Handling'
  | 'Motorway Rules'
  | 'Rules of the Road'
  | 'Road and Traffic Signs'
  | 'Documents'
  | 'Accidents'
  | 'Vehicle Loading';

export const ALL_CATEGORIES: Category[] = [
  'Alertness',
  'Attitude',
  'Safety and Your Vehicle',
  'Safety Margins',
  'Hazard Awareness',
  'Vulnerable Road Users',
  'Other Types of Vehicle',
  'Vehicle Handling',
  'Motorway Rules',
  'Rules of the Road',
  'Road and Traffic Signs',
  'Documents',
  'Accidents',
  'Vehicle Loading',
];

export type Question = {
  id: string;
  category: Category;
  question: string;
  image_url?: string | null;
  options: AnswerOption[];
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
};
