import { PageContent } from '@/app/page-content'
import { ApisInstanceList } from '@/features/home/apis-instance-list'
import { HomeLayout } from '@/features/home/home.layout'
import { HomePageLeadIn } from '@/features/home/home-page-lead-in'
import { HomePageTitle } from '@/features/home/home-page-title'

export default function HomePage(): JSX.Element {
  return (
    <PageContent>
      <HomeLayout>
        <HomePageTitle>Explore APIS social network data</HomePageTitle>
        <HomePageLeadIn>
          The{' '}
          <a href="https://www.oeaw.ac.at/acdh/tools/apis-app" rel="noreferrer" target="_blank">
            Austrian Prosopographical | Biographical Information System (APIS)
          </a>{' '}
          allows extracting information about persons, places, institutions, works and events, as
          well as arbitrary relations between these entities, from textual data. To visually explore
          these social networks, select one of the available datasets.
        </HomePageLeadIn>
        <ApisInstanceList />
      </HomeLayout>
    </PageContent>
  )
}
