# Patient-Advocacy-Service
Patient Advocacy Service Website - Bolt.new Deployment Guide
This guide provides step-by-step instructions on how to deploy the Patient Advocacy Service website to the Bolt.new platform.
Project Overview
The Patient Advocacy Service website is a dynamic, interactive React application designed to help patients, providers, and employers navigate the complexities of insurance approvals. It features a professional landing page, interactive pricing calculator, dynamic testimonials, and a functional contact form.
Prerequisites
Before you begin, ensure you have the following:
	•	A Bolt.new account
	•	A GitHub account
	•	Git installed on your local machine

Deployment Steps
1. Create a New Bolt.new Project
	1	Log in to your Bolt.new account.
	2	Click the "New Project" button.
	3	Select "Import from Git Repository."

2. Connect to Your Git Repository
	1	Connect your GitHub account to Bolt.new.
	2	Select the repository containing the Patient Advocacy Service website.
	3	Choose the main branch for deployment.

3. Configure Build Settings
Bolt.new will automatically detect that this is a React project and configure the build settings for you. However, you should verify the following:
	•	Framework Preset: React
	•	Build Command: npm run build
	•	Output Directory: dist

4. Deploy the Website
	1	Click the "Deploy" button.
	2	Bolt.new will build and deploy your website.
	3	Once the deployment is complete, you will be provided with a public URL.
Post-Deployment
	1	Access your deployed website using the provided URL.
	2	Verify that all dynamic features are working correctly:
	◦	Interactive pricing calculator
	◦	Rotating testimonials
	◦	Expandable FAQ section
	◦	Functional contact form
Congratulations! You have successfully deployed the Patient Advocacy Service website to Bolt.new.
