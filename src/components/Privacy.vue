<template>
    <div>
        <skeleton-nav></skeleton-nav>

        <div class="container m-t-20">
            <div class="columns">
                <div class="column">
                    <div class="content" style="padding: 10px">
                        <h1>Privacy Policy</h1>
                        <p>
                            Your privacy is important to blabber, we’ll make sure you’re secured.<br><br>

                            Blabber will take reasonable, technical and organizational precautions to prevent the loss, misuse or alteration of your personal information.<br>
                            This privacy policy covers blabber’s treatment of personal information provided by users and other information that Blabber assembles while users access the application or the website.<br><br>

                            <strong>Personal Information</strong><br>
                            <strong>Information you provide</strong><br>
                            Blabber stores any information you enter while accessing our service or provide in any other way. Personal information you provide us about your self includes your name, e-mail address, optional phone number, Facebook username, information regarding your use of service with a password you set yourself to protect your account.
                            Personal information provided by users are for specific purposes only such as, creating an account and profile that’s used to access the service, interact with other users, customizing the content each user sees and get to use other activities such as rating, reviewing and checking in.<br><br>

                            <strong>Information Collected Automatically</strong><br>
                            When you use the service, Blabber automatically receives and records information on our server logs from your browser or mobile platform, including your location, IP address, cookie information, and the page you requested. Blabber only uses this data in aggregate form. We may provide aggregate information to our partners about how our users collectively use our service, so that our partners may also understand how often people use their services and our service.<br>
                            Your location is automatically received to us while using the service, location is collected through various technologies used to determine location, such as location services of the applicable operating system or browser and sensor data from your devices.<br><br>

                            <strong>Sharing location</strong><br>
                            Blabber needs to know your location in order to work and be accurate in offering the service so whenever you’re using Blabber whether the application or the website your location is collected to tailor your blabber experience based on your current location (i.e. nearest business to you) This information is confidential and not shared with others.<br>
                            <strong>Blabber features</strong><br>
                            Blabber app and website include several features that may allow you to share your info with others, please review them carefully because it may be available to the wider blabber community through the application and the website.<br>
                            Usage information<br>
                            Blabber may record information about your usage such as when you use blabber communities, access business profiles, subscribe to your favourite businesses, the content you access, the frequency and the size of data transfers as well as info you display or click on it.<br><br>

                            <strong>Is my personal information secure?</strong><br>
                            Definitely! Your blabber account personal information is protected by a password for your privacy and security. You need to prevent any unauthorized access to your account and personal information by accurately selecting and protecting your password.<br>
                            Blabber aims to secure user’s personal information to make sure accounts are private and secure, however Blabber cannot guarantee the security of user account information through unauthorized entry or use, hardware or software failure and other factors may compromise the security of user info at any time.<br>
                            The links included in the app or website that leads to other sites blabber is not responsible for their privacy policy.<br><br>

                            If you have any questions or concerns regarding privacy, using the app or the website please send a detailed message to <a href="mailto:info@myblabber.com">info@myblabber.com</a><br>
                            We take every message into consideration and we’ll do our best to resolve your concerns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SkeletonNav from './partials/skeletonNav.vue';

    export default {
        name: 'privacy',

        components: {
            skeletonNav: SkeletonNav,
        }
    }
</script>
