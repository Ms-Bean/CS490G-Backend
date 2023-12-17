pipeline {
    agent any

    parameters {
        string(name: 'BACKEND_BRANCH', defaultValue: 'dev', description: 'Branch to checkout for Backend')
        string(name: 'DB_HOST', defaultValue: '172.19.0.3', description: 'Database Host')
        string(name: 'DB_NAME', defaultValue: 'moxi', description: 'Database Name')
        string(name: 'FRONTEND_URL', defaultValue: 'http://moxi.akifbayram.com', description: 'Frontend URL')
        string(name: 'BACKEND_URL', defaultValue: 'http://moxi.akifbayram.com:3500', description: 'Backend URL')
    }

    environment {
        DB_USER = '' // Define in Jenkins Credentials
        DB_PASS = '' // Define in Jenkins Credentials
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
                        sh 'docker build --build-arg FRONTEND_URL=${params.FRONTEND_URL} --build-arg BACKEND_URL=${params.BACKEND_URL} -t moxi-backend .'
                        sh """
                        docker run -d --name moxi-backend \
                        --restart=unless-stopped \
                        -e DB_HOST=${params.DB_HOST} \
                        -e DB_NAME=${params.DB_NAME} \
                        -e DB_USER=\$DB_USER \
                        -e DB_PASS=\$DB_PASS \
                        -e FRONTEND_URL=${params.FRONTEND_URL} \
                        -e BACKEND_URL=${params.BACKEND_URL} \
                        -p 3500:3500 \
                        moxi-backend
                        """

                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -af'
        }
        success {
            echo 'Backend Build and Deployment completed successfully.'
        }
        failure {
            echo 'Backend Build or Deployment failed.'
        }
    }
}
