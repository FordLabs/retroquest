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
      parallel {
        stage('Frontend Tests') {
          steps {
            sh 'cd ui && npm run unit && cd ..'
          }
        }
        stage('Lint SCSS') {
          steps {
            sh 'cd ui && npm run sass-lint'
          }
        }
        stage('Lint Typescript') {
          steps {
            sh 'cd ui && npm run lint'
          }
        }
        stage('Build Prod') {
          steps {
            sh 'cd ui && npm run build-prod'
          }
        }
      }
    }
    stage('Archive') {
      parallel {
        stage('Archive') {
          steps {
            archiveArtifacts 'api/build/libs/retroquest.jar'
          }
        }
        stage('Deploy') {
          steps {
            sh 'cf push'
          }
        }
      }
    }
  }
}