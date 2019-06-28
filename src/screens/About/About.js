import React from 'react'

import styles from './About.module.css'

const AboutPage = () => (
  <div className={styles.Container}>
    <div className={styles.Content}>
      <h2 className={styles.Heading}>About</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum,
        veritatis eaque! Explicabo magnam culpa voluptas eligendi tempora facere
        illo incidunt deserunt, qui libero molestiae assumenda iusto odio,
        dolores sit beatae.
      </p>
      <h2 className={styles.Heading}>Contact</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum,
        veritatis eaque! Explicabo magnam culpa voluptas eligendi tempora facere
        illo incidunt deserunt, qui libero molestiae assumenda iusto odio,
        dolores sit beatae.
      </p>
    </div>
  </div>
)

export default AboutPage
