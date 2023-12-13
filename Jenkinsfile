pipeline {
    agent any

    parameters {
        string(name: 'BACKEND_BRANCH', defaultValue: 'dev', description: 'Branch to checkout for Backend')
    }

    environment {
        DB_HOST = '172.19.0.3' // GCP Cloud SQL IP
        DB_NAME = 'moxi'
        DB_USER = '' // Define in Jenkins Credentials
        DB_PASS = '' // Define in Jenkins Credentials
        FRONTEND_URL = 'http://moxi.akifbayram.com'
    }

    stages {
        stage('Cleanup Backend Container') {
            steps {
                sh 'docker stop moxi-backend || true'
                sh 'docker rm moxi-backend || true'
            }
        }
        
        stage('Checkout Backend') {
            steps {
                sh 'mkdir -p CS490G-Backend'
                dir('CS490G-Backend') {
                    git branch: params.BACKEND_BRANCH, url: 'https://github.com/Ms-Bean/CS490G-Backend.git'
                }
            }
        }

        stage('Build and Run Backend') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'db-credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                    dir('CS490G-Backend') {

                        sh 'docker build -t moxi-backend .'
                        sh """
                        docker run -d --name moxi-backend \
                        -e DB_HOST=\$DB_HOST \
                        -e DB_USER=\$DB_USER \
                        -e DB_PASS=\$DB_PASS \
                        -e DB_NAME=\$DB_NAME \
                        -e FRONTEND_URL=\$FRONTEND_URL \
                        -p 3500:3500 \
                        moxi-backend
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Backend Build and Deployment completed successfully.'
        }
        failure {
            echo 'Backend Build or Deployment failed.'
        }
    }
}
