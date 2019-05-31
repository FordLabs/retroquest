pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh './gradlew clean build'
      }
    }
    stage('Install Deps') {
      steps {
        sh 'cd ui/ && npm install && cd ..'
      }
    }
    stage('Frontend Tests') {
      steps {
        sh 'cd ui && npm run unit && cd ..'
      }
    }
  }
}