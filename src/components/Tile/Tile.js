import React from 'react'

import styles from './Tile.module.css'

import classNames from '../../utils/class-names'

const Tile = ({
  className,
  title,
  subtitle,
  description,
  title_img: image,
  onClick,
  public: restricted,
  app_url: projectUrl,
}) => (
  <div
    className={classNames(styles.Tile, className)}
    role="button"
    onClick={onClick}
  >
    <div className={styles.ImageContainer}>
      <img className={styles.Image} src={image} alt="" />
    </div>
    <div className={styles.Content}>
      <h4 className={styles.Title}>
        {restricted === 'restricted' ? '\u{1f512}' : null} {title}
      </h4>
      <div className={styles.Subtitle}>{subtitle}</div>
      <div className={styles.Description} title={description}>
        {description.slice(0, 240)}
      </div>
      <a
        className={styles.ProjectLink}
        href={projectUrl}
        // FIXME: anchor inside anchor tag is totally not accessible!
        onClick={event => {
          event.stopPropagation()
        }}
      >
        Go to Project page
      </a>
    </div>
  </div>
)

export default Tile
