pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/jerina9558/voting-app.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        // Remove or comment out this block ↓
        /*
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        */
    }
}
