import React from 'react'
import Spinner from '../../elements/Spinner/Spinner'
import { APIS_INSTS } from '../../constants'
import styles from './ProjectList.module.css'

class ProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    }
  }

  componentDidMount() {
    fetch(APIS_INSTS)
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result,
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error,
          })
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <Spinner />
    } else {
      return (
        <div className={styles.GridStyle}>
          {items.map(item => (
            <div key={item.app_url} className={styles.GridItem}>
              <h1>{item.title.toString()}</h1>
              <h2>{item.subtitle}</h2>
              <a href={item.app_url}>
                <img
                  src={item.img}
                  alt={item.subtitle}
                  className={styles.ImgCenter}
                />
              </a>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )
    }
  }
}

export default ProjectList
