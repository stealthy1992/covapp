pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        BASE_URL      = 'https://covapp-gamma.vercel.app'
        COLLECTION    = 'tests/covid_api_postman_collection.json'
        ENVIRONMENT   = 'tests/covid_api_postman_variables.json' 
        REPORT_DIR    = 'newman-reports'
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
                // Local install avoids global PATH issues entirely
                bat 'npm install newman newman-reporter-htmlextra'
            }
        }

        stage('Wait for Vercel Deployment') {
            steps {
                echo "Polling Vercel until deployment is live..."
                // Polls every 15s, gives up after 3 minutes
                timeout(time: 3, unit: 'MINUTES') {
                    waitUntil {
                        script {
                            def rawOutput = bat(
                                script: "curl -s -o NUL -w \"%%{http_code}\" ${BASE_URL}",
                                returnStdout: true
                            ).trim()

                            def status = rawOutput.tokenize('\n').last().trim()
                            echo "Vercel status: ${status}"
                            return status == '200'
                        }
                    }
                }
            }
        }

        stage('Run Postman Collection (Newman)') {
            steps {
                // Create report directory
                bat "if not exist ${REPORT_DIR} mkdir ${REPORT_DIR}"

                // Use npx so it finds the locally installed newman
                bat """
                    npx newman run "${COLLECTION}" ^
                    -e "${ENVIRONMENT}" ^
                    --env-var base_url=${BASE_URL} ^
                    --reporters cli,htmlextra,json ^
                    --reporter-htmlextra-export ${REPORT_DIR}/report.html ^
                    --reporter-json-export ${REPORT_DIR}/report.json ^
                    --timeout-request 15000
                """
            }
        }

    
    }

    post {
        always {
            publishHTML(target: [
                allowMissing         : true,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : "${REPORT_DIR}",
                reportFiles          : 'report.html',
                reportName           : 'Newman Test Report',
                reportTitles         : 'API Test Results'
            ])
        }
        success {
            echo "✅ All Postman tests passed!"
        }
        failure {
            echo "❌ Some tests failed. Check Newman report."
        }
    }
}