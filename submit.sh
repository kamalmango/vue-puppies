#!/bin/bash
#
# A small script to help submit summary assessment solutions
# Author: Dan Thareja <dan.thareja@hackreactor.com>
#

RED=$'\e[31m'
GREEN=$'\e[32m'
YELLOW=$'\e[33m'
MAGENTA=$'\e[35m'
CYAN=$'\e[36m'
COLORLESS=$'\e[0m'

PREFIX_REGEX="^[0-9]{4}-[0-9]{2}"
REPO_OWNER="hackreactor"
REPO_NAME="summary-assessment-solutions"
REPO_BASE_BRANCH="master"
REPO_REMOTE_ALIAS="solution"

# Input cohort prefix
read -p "${MAGENTA}Enter your cohort's prefix (e.g. 2014-07):${COLORLESS} " COHORT_PREFIX

if ! [[ $COHORT_PREFIX =~ $PREFIX_REGEX ]]; then
  echo "${RED}ERROR:${COLORLESS} Invalid prefix: ${COHORT_PREFIX}"
  echo "${YELLOW}Please enter a prefix that follows the convention 20XX-XX${COLORLESS} (e.g. 2014-07)"
  exit 1
fi

FULL_REPO_NAME=$REPO_OWNER/$COHORT_PREFIX-$REPO_NAME


# Input GitHub handle
read -p "${MAGENTA}Enter your GitHub handle:${COLORLESS} " GITHUB_HANDLE


# Check that there is no outstanding work to commit
if [[ `git status --porcelain` ]]; then
  echo "${RED}ERROR:${COLORLESS} Your working directory has some changes not yet committed."
  echo "To help ensure you haven't forgot something, the submission process has been suspended."
  echo "${YELLOW}Please clean your working directory and try again.${COLORLESS}"
  exit 1
fi


# Warn if not on master
if [[ `git rev-parse --abbrev-ref HEAD` != "master" ]]; then
  echo "${YELLOW}WARNING:${COLORLESS} This script will submit work from the current HEAD."
  echo "You do not have the 'master' branch checked out."
  read -p "${MAGENTA}Is this intentional? <y/N>${COLORLESS} " response
  if ! [[ $response =~ [yY](es)* ]]; then
    exit 1
  fi
fi


# Grant permission to solutions repo
echo "Please ask a proctor to grant you permission to the following repo:"
echo "   ${CYAN}https://github.com/$FULL_REPO_NAME${COLORLESS}"
read -p "${MAGENTA}Navigate to the link your browser.${COLORLESS} Once you can access the repo, press [ENTER] to continue... "


# Fetch the solutions repo
if [[ `git remote | grep -w $REPO_REMOTE_ALIAS` ]]; then
  git remote remove $REPO_REMOTE_ALIAS
fi

git remote add $REPO_REMOTE_ALIAS https://$GITHUB_HANDLE@github.com/$FULL_REPO_NAME
git fetch $REPO_REMOTE_ALIAS $REPO_BASE_BRANCH

if [[ $? -ne 0 ]]; then
  echo "${RED}ERROR:${COLORLESS} Fetch failed. Double check your GitHub handle and that you can access this repo on GitHub:"
  echo "    https://github.com/$FULL_REPO_NAME"
  echo "If you see a 404, you do not have access yet."
  echo "If you can see the repo, something else went wrong."
  echo "${YELLOW}Please read the error message above and find a proctor if you need help.${COLORLESS}"
  exit 1
fi


# Check for prior submission
if [[ `git ls-remote $REPO_REMOTE_ALIAS | grep -w $GITHUB_HANDLE` ]]; then
  echo "${RED}ERROR:${COLORLESS} Work has already been pushed to the branch '$GITHUB_HANDLE'."
  echo "${YELLOW}Please find a proctor if this is unexpected.${COLORLESS}"
  exit 1
fi


# Ensure closing comments have been added
if ! [[ `git diff $REPO_REMOTE_ALIAS/$REPO_BASE_BRANCH -- closing_comments.txt` ]]; then
  echo "${RED}ERROR:${COLORLESS} Closing comments not found."
  echo "${YELLOW}Please fill out and commit your changes to the closing_comments.txt file and try again.${COLORLESS}"
  exit 1
fi


# Ensure setup instructions have been added
if ! [[ `git diff $REPO_REMOTE_ALIAS/$REPO_BASE_BRANCH -- README.md` ]]; then
  echo "${RED}ERROR:${COLORLESS} README not updated."
  echo "${YELLOW}Please fill out the How To Start This App section, commit your changes, and try again.${COLORLESS}"
  exit 1
fi


# Review submission
read -p "${MAGENTA}Review your submission.${COLORLESS} Press [ENTER] to view a diff of your work..."
git diff $REPO_REMOTE_ALIAS/$REPO_BASE_BRANCH



# Confirm review
read -p "${MAGENTA}Is everything there? <y/N> ${COLORLESS}" response
if ! [[ $response =~ [yY](es)* ]]; then
  exit 0
fi


# Push work
echo "Submitting work..."
if [[ `git push $REPO_REMOTE_ALIAS HEAD:$GITHUB_HANDLE` ]]; then
  echo "${RED}ERROR:${COLORLESS} Push failed."
  echo "${YELLOW}Please read the error message above and find a proctor if you need help.${COLORLESS}"
  exit 1
fi


# Confirm push
if [[ `git diff $REPO_REMOTE_ALIAS/$GITHUB_HANDLE` ]]; then
  echo "${RED}ERROR:${COLORLESS} Push failed. Expected no diff between HEAD and ${REPO_REMOTE_ALIAS}/${GITHUB_HANDLE}"
  echo "${YELLOW}Please read the error message above and find a proctor if you need help.${COLORLESS}"
  exit 1
fi


# Done!
git remote remove $REPO_REMOTE_ALIAS
echo "${GREEN}Submission received${COLORLESS} 👍"
