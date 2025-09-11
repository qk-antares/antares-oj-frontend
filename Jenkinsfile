pipeline {
    agent any

    // 使用Jenkins上的nodejs 18工具
    tools {
        nodejs 'nodejs 18'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm run build'
            }
        }

        stage('Deploy') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'host-deploy', // 名称要和你 SSH 配置里的 Name 完全一致！
                        transfers: [
                            sshTransfer(
                                sourceFiles: 'dist/**',
                                removePrefix: 'dist', // 删除路径前缀，保留 dist 下结构
                                remoteDirectory: './frontend/antares-oj-frontend', // 远程路径
                                execCommand: '''
                                    echo "✅ 文件上传完成，开始执行部署任务"
                                '''
                            )
                        ],
                        usePromotionTimestamp: false,
                        verbose: true
                    )
                ])
            }
        }
    }

    post {
        success {
            echo '部署成功 ✅'
        }
        failure {
            echo '部署失败 ❌'
        }
    }
}