<template>
    <div>
        <skeleton-nav style="height: auto"></skeleton-nav>
        <section>
        	<div class="container" style="padding: 10px">
				<br><p>Blabber is your social platform for all the businesses you need. It will let you discover and keep track of everything that interests you. Whether you’re looking for a fancy restaurant to a coffee shop nearby or even a street kiosk that is open now. Blabber will help you out and be your guide to find any business, reach it and check its reviews.<p><br>
				<p>Blabber mobile app and website is where you get reviews on local business; coffee shop, restaurant, local services businesses, local shops and stores, from local people who have already visited or used the store or the service. You will find helpful reviews and tips. You will also see your friends’ comments, reviews and check-ins.</p><br> 
				<ul>
					<li>· Explore great local businesses, and learn about the best in town. You name it, from cafes to large corporations</li>
					<li>· Get to know what restaurants are open, how to get there with accurate navigation and even what to order based on several reviews on food menus. You will always feel like the mayor of the place -- and you may actually become one ;)</li>
					<li>· Rate, review, check in and upload photos and connect with your friends</li>
					<li>· Search for what’s around you and filter by simply selecting your interests among the list we already prepared for your and we are continuously adding more interest and definitely adding more business that we explore, visit and validate..</li>
					<li>· Get updates from your favorite local businesses and shops based on your personal customization category</li>
					<li>· Follow your friends, favorite brands and venues to stay up to date with the newest trends</li>
					<li>· Keep track of new products, deals offered by your saved businesses</li>
					<li>· Read reviews of users on the business you need</li>
					<li>· Easily find your way around the city by simply using its supported navigation system</li>
				</ul>
        	</div>
        </section>
    </div>
</template>

<script>
    import Auth from '../services/auth';
    import SkeletonNav from './partials/skeletonNav.vue';

    export default {
        name: 'businessprofile',

        components: {
            skeletonNav: SkeletonNav,
        },
    }
</script>