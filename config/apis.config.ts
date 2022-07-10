import type { UrlString } from '@/lib/types'

export interface UserAuth {
  username: string
  password: string
}

export interface ApisInstanceConfig {
  id: string
  title: string
  subtitle: string
  description: string
  url: UrlString
  image: UrlString
  access: { type: 'public' } | { type: 'restricted'; user: UserAuth | null }
}

const apis: ApisInstanceConfig = {
  id: 'apis',
  title: 'APIS',
  subtitle:
    'Mapping historical networks: Building the new Austrian Prosopographical | Biographical Information System',
  description:
    'Das Österreichische Biographische Lexikon (ÖBL) ist das einzige enzyklopädische Werk in Mitteleuropa, das Lebens- und Karriereverläufe verdienter Persönlichkeiten des gesamten Gebiets der ehemaligen österreichisch-ungarischen Monarchie sowie der Ersten/Zweiten Republik erfasst. Basierend auf den rund 18.000 publizierten und bereits digital verfügbaren Biographien werden in Zusammenarbeit mit dem Austrian Centre for Digital Humanities and Cultural Heritage (ACDH-CH-CH) und dem Institut für Stadt- und Regionalforschung (ISR) durch den Einsatz unterschiedlicher Methoden der Computerlinguistik (differenzierte, textlinguistische Erschließung), moderner IT-Strukturen und des Semantic Web Möglichkeiten geschaffen, um Lösungsansätze für Forschungsfragen im geistes-, sozial- und kulturwissenschaftlichen Kontext zu unterstützen und spezifische Auswertungen zu ermöglichen. Das ÖBL wird durch Transformation in eine adäquate Forschungsinfrastruktur maschinenlesbar (RDF, SKOS), semantisch angereichert, in der Linked Open Data Cloud publiziert (Open-Access Bereitstellung der Daten unter der CC-BY-NC Lizenz) sowie vollständig an internationale Standards angebunden (GND, VIAF); eine Integration in bestehende europäische Initiativen (DARIAH, CLARIN, EUROPEANA) ist projektiert. Dadurch wird zugleich die maximale Zugänglichkeit der Forschungsdaten erreicht. Im Sinne transdisziplinärer Zusammenarbeit verbindet sich die Expertise des ÖBL (historisch-biographische Forschung) mit jener des ACDH-CH im Bereich der Corpuslinguistik und Textechnologie zur Entwicklung innovativer Methoden, um beispielhaft konkreten sozialwissenschaftlichen Forschungsfragen des ISR eine neue Plattform zu bieten; parallel wird eine umfangreiche sozialwissenschaftliche und demographische Analyse der Wanderungsformen und Wanderungsmuster gesellschaftlicher Eliten im 19. und frühen 20. Jahrhundert mit besonderer Berücksichtigung der politischen Brüche innerhalb dieses Zeitraums erarbeitet/publiziert. Das Projekt schlägt damit die Brücke von den Geisteswissenschaften über die Texttechnologie und Semantic Web-Ansätze zu den Sozialwissenschaften; es ist modellhaft, zukunftsweisend und realisiert Interdisziplinarität anhand eines konkreten "Werkstücks".',
  url: 'https://apis.acdh-dev.oeaw.ac.at',
  image: '/assets/images/apis.jpg',
  access: { type: 'restricted', user: null },
}

const ica: ApisInstanceConfig = {
  id: 'ica',
  title: 'Ideas Crossing the Atlantic',
  subtitle: 'Theories, Normative Conceptions, and Cultural Images',
  description:
    'The resurgence of nationalisms worldwide has reignited scholarly interest in the dissemination of ideas and cultural concepts across political and geographic borders and especially across the Atlantic. This volume is the result of an international gathering held in December 2016 at the Austrian Academy of Sciences, which was devoted to the exploration of (voluntary and enforced) transcultural migrations before, during, and after the two World Wars. In 25 incisive, wide-ranging chapters, scholars from Austria, Canada, the Czech Republic, France, Germany, Hungary, Italy, Poland, Slovenia, Spain, the United Kingdom, and the United States, revisit a century marked by international connectedness and productive cross-fertilization in the fields of literature, philosophy, science, and the arts. Taken as a whole, these essays offer a powerful antidote to new attempts to redraw the world’s boundaries according to ethnocultural dividing lines.',
  url: 'https://ica.acdh-dev.oeaw.ac.at',
  image: '/assets/images/ica.jpg',
  access: { type: 'public' },
}

const mpr: ApisInstanceConfig = {
  id: 'mpr',
  title: 'Modulare Prosopographische Registratur (MPR)',
  subtitle:
    'Entities mentioned in various projects of the "Institute for Habsburg and Balkan Studies" (IHB): "Minutes of the council of the ministers of Austria and of the Austro-Hungarian Monarchy" (MRP), "Digital Scholarly Edition of Habsburg-Ottoman Diplomatic Sources 1500–1918" (QhoD), and more.',
  description:
    'The current web application considers itself as an "Entity-Hub" of all entities (persons, places, institutions, works and events) mentioned in the XML-TEI digital editions published by the IHB.',
  url: 'https://mpr.acdh.oeaw.ac.at',
  image: '/assets/images/mpr.jpg',
  access: { type: 'public' },
}

const pmb: ApisInstanceConfig = {
  id: 'pmb',
  title: 'PMB',
  subtitle: 'Personen der Moderne Basis',
  description:
    'Durch die Normdatei PMB wird ein Webservice für Personen, Werke, Institutionen, Orte und Ereignisse speziell für die Zeit in Wien um 1900 zur Verfügung gestellt.',
  url: 'https://pmb.acdh.oeaw.ac.at',
  image: '/assets/images/pmb.jpg',
  access: { type: 'public' },
}

export const config = {
  instances: { apis, ica, mpr, pmb },
}

/** Default `limit` search parameter. */
export const limit = 20

/** Default `limit` search parameter for getting relations. */
export const chunk = 250
