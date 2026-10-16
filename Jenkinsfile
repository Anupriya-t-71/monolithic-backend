pipeline {
    agent any

    environment {
        IMAGE_NAME = 'app-backend'
        CONTAINER_NAME = 'backend-contain'
        EC2_IP = '100.53.248.149'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'git_creds',
                    url: 'https://github.com/vijishvk/E-flow-Backend.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2_creds']) {
                    sh '''
                        ssh -A -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "set -e && \
                            rm -rf /home/ubuntu/backend && \
                            mkdir -p /home/ubuntu/backend && \
                            cd /home/ubuntu/backend && \
                            git clone https://github.com/vijishvk/E-flow-Backend.git && \
                            cd /home/ubuntu/backend/E-flow-Backend && \
                            (docker stop ${CONTAINER_NAME} || true) && \
                            (docker rm ${CONTAINER_NAME} || true) && \
                            (docker rmi ${IMAGE_NAME} || true) && \
                            docker build -t ${IMAGE_NAME} . && \
                            docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Backend deployed successfully"
        }
        failure {
            echo "Failed"
        }
    }
}
