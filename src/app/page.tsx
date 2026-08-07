import { Hero } from '@/components/sections/hero';
import { Achievements } from '@/components/sections/achievements';
import { Flagship } from '@/components/sections/flagship';
import { Projects } from '@/components/sections/projects';
import { GitHubActivity } from '@/components/sections/github';
import { Journey } from '@/components/sections/journey';
import { Notes } from '@/components/sections/notes';
import { Resume } from '@/components/sections/resume';
import { Contact } from '@/components/sections/contact';
import { projectsSchema } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Achievements />
      <Flagship />
      <Projects />
      <GitHubActivity />
      <Journey />
      <Notes />
      <Resume />
      <Contact />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
    </>
  );
}
