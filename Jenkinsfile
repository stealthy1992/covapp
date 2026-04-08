pipeline {
    agent any

    environment {
        // Your deployed Vercel URL
        BASE_URL = 'http://covapp-gamma.vercel.app/'

        // Paths inside Jenkins workspace
        COLLECTION = 'tests/Covid API.postman_collection.json'

        REPORT_DIR = 'newman-reports'
    }

    stages {

        stage('Checkout Code from GitHub') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/stealthy1992/covapp.git'
            }
        }

        stage('Install Newman') {
            steps {
                sh 'npm install -g newman newman-reporter-html'
            }
        }

        stage('Wait for Vercel Deployment') {
            steps {
                echo "Waiting for Vercel to deploy latest build..."
                sleep 120   // Adjust based on your deploy speed
            }
        }

        stage('Run Postman Collection (Newman)') {
            steps {
                sh """
                mkdir -p ${REPORT_DIR}

                newman run ${COLLECTION} \
                --env-var base_url=${BASE_URL} \
                --reporters cli,htmlextra,json \
                --reporter-html-export ${REPORT_DIR}/report.html \
                --reporter-json-export ${REPORT_DIR}/report.json \
                --timeout-request 15000
                """
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: "${REPORT_DIR}/*", fingerprint: true
            }
        }
    }

    post {
        success {
            echo "✅ All Postman tests passed!"
        }
        failure {
            echo "❌ Some tests failed. Check Newman report."
        }
    }
}