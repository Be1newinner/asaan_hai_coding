interface tutorial_base {
  id: string | number;
  title: string;
  description: string;
  image: string;
  category: string;
  readTime: string;
  publishedAt: string;
  slug: string;
}

type tutorial_list_response = tutorial_base[];
