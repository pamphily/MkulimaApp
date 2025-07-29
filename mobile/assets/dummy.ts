import { Course } from "../types/Education";

  
  export const demoCourses: Course[] = [
    {
      id: 'c1',
      title: 'Introduction to Sustainable Farming',
      description: 'Learn principles of sustainable agriculture to improve yield and protect environment.',
      imageUri: 'https://via.placeholder.com/300x200.png?text=Sustainable+Farming',
      category: 'Sustainability',
      lessons: [
        { id: 'l1', title: 'What is Sustainable Farming?', type: 'text', contentText: 'Sustainable farming is ...' },
        { id: 'l2', title: 'Soil Health', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
      price: 40900.99,
    },
    {
      id: 'c2',
      title: 'Crop Rotation Techniques',
      description: 'Understand crop rotation and its benefits.',
      imageUri: 'https://via.placeholder.com/300x200.png?text=Crop+Rotation',
      category: 'Crop Management',
      lessons: [
        { id: 'l1', title: 'Basics of Crop Rotation', type: 'text', contentText: 'Crop rotation means ...' },
        { id: 'l2', title: 'Planning Rotation Schedules', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
      price: 49.99,
    },
    {
      id: 'c3',
      title: 'Organic Pest Control',
      description: 'Natural methods to manage pests without harmful chemicals.',
      imageUri: 'https://via.placeholder.com/300x200.png?text=Organic+Pest+Control',
      category: 'Pest Management',
      lessons: [
        { id: 'l1', title: 'Common Pests and Identification', type: 'text', contentText: 'Pests include ...' },
        { id: 'l2', title: 'Natural Predators', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
      price: 49.99,
    },
    {
      id: 'c4',
      title: 'Soil Testing Basics',
      description: 'Learn how to test soil pH and nutrients for optimal yield.',
      imageUri: 'https://via.placeholder.com/300x200.png?text=Soil+Testing',
      category: 'Soil Management',
      lessons: [
        { id: 'l1', title: 'Why Test Soil?', type: 'text', contentText: 'Testing soil helps ...' },
        { id: 'l2', title: 'DIY Testing Methods', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ],
      price: 49.99,
    },
  ];