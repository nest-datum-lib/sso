// Set these variables if needed.
def SERVICE_NAME="sso" // name of service or project.
def AGENT_NODE="master" // node/slave name where to run this job.

// DO NOT CHANGE!
def WORKSPACE_PATH="$JENKINS_HOME/jobs/$JOB_NAME/workspace"
def SERVICE_HOME="/home/$JOB_NAME"
def SERVICE_ROOT="$SERVICE_HOME/$SERVICE_NAME"
def TARGET_DIST_DEPLOY_PATH="$SERVICE_ROOT/dist"
def LOGS_FOLDER="$SERVICE_HOME/.pm2/logs"

pipeline {
    agent { label "$AGENT_NODE" }

    stages {

        stage('Init & Build project') {
            steps {
                dir("$WORKSPACE_PATH") {
                    sh "npm install"
                    sh "npm run build"
                    sh "sudo chmod o+rw $SERVICE_HOME/$SERVICE_NAME/.env"
                }
            }
        }

        stage('Deploy') {
            steps {
                sh "sudo chmod -R o+rw $TARGET_DIST_DEPLOY_PATH"
                sh "rm -r $TARGET_DIST_DEPLOY_PATH/* || true"

                dir("$WORKSPACE_PATH/dist") {
                    sh "cp -r ./* $TARGET_DIST_DEPLOY_PATH"
                    sh "sudo chown -R $JOB_NAME:$JOB_NAME $TARGET_DIST_DEPLOY_PATH/*"
                }

                script {
                    try {
                        sh "sudo -u $JOB_NAME pm2 delete $JOB_NAME"
                    } catch (err) {
                        echo "pm2 service $JOB_NAME not found"
                    }

                    sh "echo current dir ${pwd}"
                    sh "rm -rf $LOGS_FOLDER/* || true"
                    sh "sudo -u $JOB_NAME pm2 start $TARGET_DIST_DEPLOY_PATH/src/main.js --name $JOB_NAME --cwd $SERVICE_ROOT"
                }
            }
        }

        stage("Check for startup errors") {
            steps {
                sleep 3
                script {
                    dir("$LOGS_FOLDER") {
                        def JOB_NAME_CORRECTED="$JOB_NAME".replace("_", "-")
                        def ERR_LOGS_FILE="$LOGS_FOLDER/$JOB_NAME_CORRECTED-error.log"

                        def size=readFile("$ERR_LOGS_FILE").length()
                        def is_exist=fileExists("$ERR_LOGS_FILE")

                        echo "ERR LOG FILE exists: $is_exist"
                        echo "ERR LOG FILE size: $size"

                        if (fileExists("$ERR_LOGS_FILE") && readFile("$ERR_LOGS_FILE").length() > 0) {
                            echo "errors occured after service start:"
                            sh "cat $ERR_LOGS_FILE"
                            error "failed due startup errors!"
                        }

                        echo "service started without errors"
                    }
                }
            }
        }
    }
}
