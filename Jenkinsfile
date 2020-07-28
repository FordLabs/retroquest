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
                        container('chrome') {
                            sh './gradlew uiUnitTests -Dhttp.proxyHost=${env.HTTP_PROXY} -Dhttp.proxyPort=${env.PROXY_PORT} -Dhttps.proxyPort={$env.PROXY_PORT} -Dhttps.proxyHost=${env.PROXY_PORT} -Dhttp.nonProxyHosts=${env.NO_PROXY_HOSTS}'
                        }
                    }
                }
                stage('Lint SCSS') {
                    steps {
                        container('chrome') {
                            sh './gradlew uiLintSCSS -Dhttp.proxyHost=$HTTP_PROXY -Dhttps.proxyHost=$HTTP_PROXY -Dhttp.nonProxyHosts=$NO_PROXY_HOSTS'
                        }
                    }
                }
                stage('Lint Typescript') {
                    steps {
                        container('chrome') {
                            sh './gradlew uiLintTypeScript -Dhttp.proxyHost=$HTTP_PROXY -Dhttps.proxyHost=$HTTP_PROXY -Dhttp.nonProxyHosts=$NO_PROXY_HOSTS'
                        }
                    }
                }
                stage('Build UI Prod Package') {
                    steps {
                        container('chrome') {
                            sh './gradlew buildProdPackage -Dhttp.proxyHost=$HTTP_PROXY -Dhttps.proxyHost=$HTTP_PROXY -Dhttp.nonProxyHosts=$NO_PROXY_HOSTS'
                        }
                    }
                }
                stage('Build API') {
                    steps {
                        container('chrome') {
                            sh './gradlew  build -Dhttp.proxyHost=$HTTP_PROXY -Dhttps.proxyHost=$HTTP_PROXY -Dhttp.nonProxyHosts=$NO_PROXY_HOSTS'
                        }
                    }
                }
                stage('API Tests') {
                    steps {
                        container('chrome') {
                            sh './gradlew  apiTest -Dhttp.proxyHost=$HTTP_PROXY -Dhttps.proxyHost=$HTTP_PROXY -Dhttp.nonProxyHosts=$NO_PROXY_HOSTS'
                        }
                    }
                }
            }
        }
        stage('Deploy Dev') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'pcf-pe-prod', usernameVariable: 'CF_CCUSER', passwordVariable: 'CF_CCPASSWORD')]) {
                    container('chrome') {
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
