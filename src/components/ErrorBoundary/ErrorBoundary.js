import React, { Component } from 'react'
import { Link } from '@reach/router'

import Centered from '../../elements/Centered/Centered'

import styles from './ErrorBoundary.module.css'

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Centered className={styles.Message}>
          <div>
            Ooops, something went wrong. Click
            <Link className={styles.Link} to="/">
              here
            </Link>
            to return home.
          </div>
        </Centered>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
