pipeline {
    agent {
        label 'chrome-jdk8'
    }
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '1', artifactNumToKeepStr: '1'))
    }
    stages {
        stage('Frontend Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        sh './gradlew uiUnitTests'
                    }
                }
                stage('Lint SCSS') {
                    steps {
                        sh './gradlew uiLintSCSS'
                    }
                }
                stage('Lint Typescript') {
                    steps {
                        sh './gradlew uiLintTypeScript'
                    }
                }
                stage('Build UI Prod Package') {
                    steps {
                        sh './gradlew buildProdPackage'
                    }
                }
                stage('Build API') {
                    steps {
                        sh './gradlew  build'
                    }
                }
                stage('API Tests') {
                    steps {
                        sh './gradlew  apiTest'
                    }
                }
            }
        }
        stage('Deploy Dev') {
            withCredentials([usernamePassword(credentialsId: 'pcf-pe-prod', usernameVariable: 'CF_CCUSER', passwordVariable: 'CF_CCPASSWORD')]) {
                sh 'echo Logging in to Cloud Foundry'
                sh 'cf login -u $CF_CCUSER -p $CF_CCPASSWORD -a https://api.sys.pd01.edc1.cf.ford.com -s Platform-Enablement-prod'
                sh 'echo Blue-Green push to Cloud Foundry'
                sh 'cf blue-green-deploy dev-retroquest --delete-old-apps'
            }
        }
    }
}
}
}
