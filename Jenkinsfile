pipeline {
    agent any 
    stages {
        stage('checkout') {
            steps {
              checkout scmGit(branches: [[name: '*/anu']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-token', url: 'https://github.com/Anupriya-t-71/monolithic-backend.git']])
            }
        }
        stage('sonarqube analysis') {
            environment {
                scannerHome = tool 'sonar-scanner'
            }
            steps {
                withSonarQubeEnv(
                    credentialsId: 'sonarqube-token',
                    installationName: 'SonarQube'
                ) {
                    sh '''
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=monolithic \
                    -Dsonar.projectName=monolithic \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000
                    '''

                }
            }
        }
        stage('quality gate') {
            steps {
             waitForQualityGate abortPipeline: true, credentialsId: 'sonarqube-token'
            }
        }
        stage('push images to harbor') {
            steps {
              withCredentials([usernamePassword(credentialsId: 'harbor-credentials', passwordVariable: 'HARBOR_TOKEN', usernameVariable: 'HARBOR_USER')]) {
              sh '''
              docker build -t localhost:8090/monolithic/eflow-backend:1.0 . &&
              docker push localhost:8090/monolithic/eflow-backend:1.0
              '''
}
            }
        }
        stage('deploy on kubernetes') {
            steps {
                sh '''
                kubectl apply -f deployment.yml && 
                kubectl apply -f service.yml
                '''
            }
        }
    }
}
