pipeline {
    agent any

    tools {
        // Décommenter et configurer si NodeJS Plugin est installé :
        // nodejs 'nodejs-20'
    }

    environment {
        // Activer le Docker Build Check avec : BUILD_DOCKER=true
        BUILD_DOCKER = 'false'
    }

    stages {

        // ─────────────────────────────────────────────
        // 1. Checkout
        // ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ─────────────────────────────────────────────
        // 2. Environment Information
        // ─────────────────────────────────────────────
        stage('Environment Information') {
            steps {
                sh 'echo "=== Node.js ===" && node --version'
                sh 'echo "=== npm ===" && npm --version'
                sh 'echo "=== Docker ===" && docker --version || true'
                sh 'echo "=== Docker Compose ===" && docker compose version || true'
            }
        }

        // ─────────────────────────────────────────────
        // 3. Install Dependencies (parallèle)
        // ─────────────────────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Brazil Service') {
                    steps {
                        dir('backend-country/brazil-service') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Ecuador Service') {
                    steps {
                        dir('backend-country/ecuador-service') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Colombia Service') {
                    steps {
                        dir('backend-country/colombia-service') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend Central') {
                    steps {
                        dir('backend-central') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 4. Generate Prisma Clients (parallèle)
        // ─────────────────────────────────────────────
        stage('Generate Prisma Clients') {
            parallel {
                stage('Brazil Prisma') {
                    steps {
                        dir('backend-country/brazil-service') {
                            sh 'npx prisma generate'
                        }
                    }
                }
                stage('Ecuador Prisma') {
                    steps {
                        dir('backend-country/ecuador-service') {
                            sh 'npx prisma generate'
                        }
                    }
                }
                stage('Colombia Prisma') {
                    steps {
                        dir('backend-country/colombia-service') {
                            sh 'npx prisma generate'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 5. Run Backend Tests (parallèle)
        //    Chaque backend utilise jest --runInBand
        //    pour éviter les problèmes mémoire.
        // ─────────────────────────────────────────────
        stage('Run Backend Tests') {
            parallel {
                stage('Brazil Tests') {
                    steps {
                        dir('backend-country/brazil-service') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'reports/**/junit.xml'
                        }
                    }
                }
                stage('Ecuador Tests') {
                    steps {
                        dir('backend-country/ecuador-service') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'reports/**/junit.xml'
                        }
                    }
                }
                stage('Colombia Tests') {
                    steps {
                        dir('backend-country/colombia-service') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'reports/**/junit.xml'
                        }
                    }
                }
                stage('Central Tests') {
                    steps {
                        dir('backend-central') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'reports/**/junit.xml'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // 6. Run Frontend Tests
        // ─────────────────────────────────────────────
        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test -- --run'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/**/junit.xml'
                }
            }
        }

        // ─────────────────────────────────────────────
        // 7. Build Frontend
        // ─────────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        // ─────────────────────────────────────────────
        // 8. Validate Docker Compose
        // ─────────────────────────────────────────────
        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config'
            }
        }

        // ─────────────────────────────────────────────
        // 9. Docker Build Check (optionnel)
        //    Activer avec : BUILD_DOCKER=true
        // ─────────────────────────────────────────────
        stage('Docker Build Check') {
            when {
                expression { env.BUILD_DOCKER == 'true' }
            }
            steps {
                sh 'docker compose build'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '=== Pipeline terminé avec succès ==='
            echo 'Tous les tests passent, le frontend build, docker-compose est valide.'
        }
        failure {
            echo '=== Pipeline échoué ==='
            echo 'Consultez les logs ci-dessus pour identifier l’étape en erreur.'
        }
    }
}