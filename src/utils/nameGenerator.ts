import { uniqueNamesGenerator, Config, adjectives, animals } from 'unique-names-generator';

const crawlerAdjectives = [
  'dedicated', 'insightful', 'innovative', 'adaptable', 'rigorous',
  'supportive', 'focused', 'collaborative', 'engaged', 'persistent',
  'inquisitive', 'transformative', 'motivated', 'inspired', 'open-minded',
  'wise', 'knowledgeable', 'enlightened', 'aspirational', 'nurturing',
  'curious', 'vigilant', 'thoughtful', 'inclusive', 'progressive',
  'intuitive', 'analytical', 'strategic', 'visionary', 'flexible',
  'resourceful', 'tenacious', 'observant', 'committed', 'perceptive',
  'purposeful', 'empowering', 'reflective', 'dynamic', 'responsive',
  'proactive', 'skillful', 'competent', 'mindful', 'courageous',
  'driven', 'focused', 'connected', 'astute', 'holistic',
  'brilliant', 'pioneering', 'conscientious', 'curatorial', 'methodical',
  'trailblazing', 'empathetic', 'authentic', 'sophisticated', 'decisive',
  'reliable', 'kindhearted', 'ethical', 'cooperative', 'accomplished',
  'insightful', 'diligent', 'resilient', 'influential', 'adaptive',
  'mentoring', 'systematic', 'trustworthy', 'constructive', 'empirical',
  'competent', 'pragmatic', 'rational', 'articulate', 'energetic',
  'imaginative', 'catalytic'
];

const crawlerNouns = [
  'mentor', 'learner', 'scholar', 'coach', 'owl',
  'guide', 'innovator', 'educator', 'seeker', 'navigator',
  'pathfinder', 'pioneer', 'visionary', 'student', 'teacher',
  'professor', 'advisor', 'tutor', 'companion', 'collaborator',
  'sage', 'thinker', 'facilitator', 'researcher', 'explorer',
  'protector', 'architect', 'trailblazer', 'caretaker', 'builder',
  'advocate', 'ambassador', 'strategist', 'designer', 'creator',
  'coach', 'guardian', 'counselor', 'leader', 'planner',
  'developer', 'engineer', 'scout', 'owllet', 'nocturnal',
  'feather', 'hoot', 'observer', 'woodsman', 'educator',
  'inspector', 'attendant', 'artisan', 'thinker', 'visionary',
  'perceptor', 'analyst', 'mediator', 'tactician', 'coordinator',
  'supporter', 'encourager', 'emissary', 'modeller', 'logician',
  'philosopher', 'participant', 'communicator', 'assistant', 'sponsor',
  'engager', 'synergist', 'optimizer', 'accomplice', 'modeler',
  'enthusiast', 'altruist', 'inventor', 'catalyst', 'technologist'
];

const projectConfig: Config = {
  dictionaries: [adjectives, animals],
  separator: ' ',
  style: 'capital',
};

const crawlerConfig: Config = {
  dictionaries: [crawlerAdjectives, crawlerNouns],
  separator: ' ',
  style: 'capital',
};

const runConfig: Config = {
  dictionaries: [adjectives, ['Run']],
  separator: ' ',
  style: 'capital',
};

export const generateProjectName = () => uniqueNamesGenerator(projectConfig);
export const generateCrawlerName = () => uniqueNamesGenerator(crawlerConfig);
export const generateRunName = () => uniqueNamesGenerator(runConfig);