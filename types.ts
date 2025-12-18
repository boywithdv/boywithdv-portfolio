
export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: { web: { uri: string; title: string } }[];
}

export interface ProfileInfo {
  name: string;
  bio: string;
  skills: string[];
  location: string;
  socials: {
    github: string;
    email: string;
  };
}
