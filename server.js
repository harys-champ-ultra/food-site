const path = require("path");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = "<API_KEY>";

sgMail.setApiKey(SENDGRID_API_KEY);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


const getTopMeals = () => [
    {
        categoryName: 'Classic Meals',
        mealKits: [
            {
                title: 'Ground Pork & Miso Butter Mazeman-Style Ramen', includes: 'with Bok Choy & Edamame',
                description: 'Fresh ramen noodles are just as good in a soup as they are served “dry.” This recipe showcases the no-broth approach, referred to in Japan as mazeman. The snappy, strappy strands boil up fast, ready to meet sautéed bok choy and edamame in a delectable sauce of white miso, soy and butter. They host nibbly ground pork fragrant with sweet sesame seasonings, crispy onions and scallion tops. And it"s all ready in 10 minutes? Now that"s amazeman!',
                price: 24.99, cookingTime: 10, servings: 2, caloriesPerServing: 900, imageUrl: 'classic1.jpg', topMeal: true
            },
            {
                title: 'Breaded Fishn Sweet Potato Chips', includes: 'with Chunky Tartar Sauce & Mashed Peas',
                description: 'Getting creative with the classics is always fun, and this take on fishn chips is a prime example of a playful kitchen. The usual chips are replaced with sweet potatoes, cut into fries and oven-roasted with dill- and lemon-licked seasonings. The fillets of tilapia are dusted with spices, dunked in mayo and coated with ultra-crispy panko crumbs. Complete the look with buttery mashed peas and roasted string peas, plus a quick-made tartar sauce with cornichons and capers for the capper.',
                price: 33.99, cookingTime: 30, servings: 2, caloriesPerServing: 1010, imageUrl: 'classic2.jpg', topMeal: false
            }
        ]
    },
    {
        categoryName: 'Easy Prep Meals',
        mealKits: [
            {
                title: 'Seoul-Style Ground Beef Meatball Bowls', includes: 'with Roasted Vegetables & Kimchi Rice',
                description: 'To give these meatballs some serious topspin, we"ve thrown them a Korean curve. A combination of soy sauce and gochujang—the fermented red chili paste—packs some heat into the ground beef. Asian greens and diced butternut squash get a dusting of sesame-ginger seasoning before roasting to tenderness. You"ll fluff a little ready-to-go kimchi into the rice, along with a splash of vinegar and a dash of hot stuff in the mayonnaise. The circle of comfort is complete.',
                price: 32.99, cookingTime: 25, servings: 2, caloriesPerServing: 930, imageUrl: 'easy1.jpg', topMeal: false
            },
            {
                title: 'Stuffed Portobello Mushrooms over Savoury Grains', includes: 'with Goat Cheese, Leafy Greens & Chive Sauce',
                description: 'Get stuffed with these portobello caps, filled to the brim with a mouthwatering mélange of garlicky leafy greens, panko and smooth goat cheese, and then quickly baked to golden and tender in the oven. You"ll serve the pretty packages atop cracked freekeh, a delightfully chewy and naturally savoury grain, tossed with crisp radishes for contrast. A tangy mayonnaise-based sauce studded with chives gives this meatless meal a luscious touch.',
                price: 18.99, cookingTime: 25, servings: 2, caloriesPerServing: 760, imageUrl: 'easy2.jpg', topMeal: true
            }
        ]
    },
    {
        categoryName: 'Clean15 (Low carb)',
        mealKits: [
            {
                title: 'Pan-Seared Mini Pork Meatloaves', includes: 'over Butternut Squash Mash with Roasted Broccoli',
                description: 'Nosh on a delicious dose of nostalgia with meatloaf and mash, done the carb-conscious way. Rather than one big loaf, you"ll make adorable individual-size ground pork meatloaves, starting them on the stovetop and finishing them under the broiler with a glaze of flavour-packed BBQ sauce. Upgrade regular tater mash with butternut squash for velvety depth and add a generous portion of roasted broccoli. In less than half an hour, you"ve improved on a dinnertime classic.',
                price: 14.99, cookingTime: 25, servings: 2, caloriesPerServing: 700, imageUrl: 'clean1.jpg', topMeal: true
            },
            {
                title: 'Seared Chicken with Tarragon Cream', includes: 'Roasted Radishes & Brussels Sprouts',
                description: 'A sleeper hit among herbs, tarragon doesn"t have as high a public profile as basil, thyme or sage. Nonetheless, we love its distinctive, bittersweet notes of anise, which shine through in this speedy and sensuous dish. You"ll toss Brussels sprouts and radishes in lemony seasonings and put them in the oven to roast. Sear the chicken to its juicy best, and coat it with a succulent sauce that stirs together Dijon mustard with cream, demi-glace and freshly chopped tarragon leaves. A star is born!',
                price: 33.99, cookingTime: 20, servings: 2, caloriesPerServing: 520, imageUrl: 'easy2.jpg', topMeal: false
            }
        ]
    }
]


// Add your routes here
// index page
app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'Home',
        data: getTopMeals
    });
})

// menu page
app.get('/menu', (req, res) => {
    res.render('menu', {
        pageTitle: 'Menu',
        data: getTopMeals
    });
})

// signup page
app.get('/signup', (req, res) => {
    res.render('signup', {
        pageTitle: 'Sign Up'
    });
})

// login page
app.get('/login', (req, res) => {
    res.render('login', {
        pageTitle: 'Login'
    });
})

// welcome page
app.get('/welcome', (req, res) => {
    res.render('welcome', {
        pageTitle: 'Welcome',
        site: 'Awesome Food',
        shortMsg: 'Welcome! We are delighted to see you here.'
    });
})

// form submit login
app.post('/processLogin', (req, res) => {
    if (req.method == 'POST') {
        const email = req.body.email
        const password = req.body.password
        // for both empty values
        if ((email.length <= 0) && (password.length <= 0)) {
            res.render('login', {
                pageTitle: 'Login',
                succMsg: '',
                cont: '',
                errEmail: 'Please enter you email',
                errPassword: 'Please enter you password'
            })
        }
        // for empty email value
        else if ((email.length <= 0)) {
            res.render('login', {
                pageTitle: 'Login',
                succMsg: '',
                cont: '',
                errEmail: 'Please enter you email',
                errPassword: ''
            })
        }
        // for empty password value
        else if ((password.length <= 0)) {
            res.render('login', {
                pageTitle: 'Login',
                succMsg: '',
                cont: '',
                errEmail: '',
                errPassword: 'Please enter you password'
            })
        }
        // for both fill values
        else {
            res.render('login', {
                pageTitle: 'Login',
                succMsg: 'Login Success',
                cont: 'Continue',
                errEmail: '',
                errPassword: ''
            })
            res.redirect('welcome')
        }
    }
})

// form submit signup
app.post('/processSignup', (req, res) => {
    if (req.method == 'POST') {
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const password = req.body.password
        // for both empty values
        if ((firstname.length <= 0) && (lastname.length <= 0) && (email.length <= 0) && (password.length <= 0)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: 'Please enter you first name',
                errLname: 'Please enter you last name',
                errEmail: 'Please enter you email',
                errPassword: 'Please enter you password'
            })
        }
        // for empty first name value
        else if ((firstname.length <= 0)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: 'Please enter you first name',
                errLname: '',
                errEmail: '',
                errPassword: ''
            })
        }
        // for empty email value
        else if ((lastname.length <= 0)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: '',
                errLname: 'Please enter you last name',
                errEmail: '',
                errPassword: ''
            })
        }
        // for valid email value
        else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: '',
                errLname: '',
                errEmail: 'Please enter a valid email address',
                errPassword: ''
            })
        }
        // for empty email value
        else if ((email.length <= 0)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: '',
                errLname: '',
                errEmail: 'Please enter you email',
                errPassword: ''
            })
        }
        // for empty password value
        else if ((password.length <= 0)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: '',
                errLname: '',
                errEmail: '',
                errPassword: 'Please enter you password'
            })
        }
        // for less or more password value
        else if ((password.length < 8) || (password.length > 12)) {
            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: '',
                cont: '',
                errFname: '',
                errLname: '',
                errEmail: '',
                errPassword: 'Password must between 8 to 12 characters'
            })
        }
        // for both fill values
        else {
            const msg = {
                to: email,
                from: 'user@email.com',
                subject: 'Welcome to the AwesomeFood',
                text: "Well done. By signing up, you've taken your first step towards a happier, healthier life. We'll do everything we can to provide you a healthier and tastier meal that meets your expectations."
            }
            sgMail.send(msg)

            res.render('signup', {
                pageTitle: 'Sign Up',
                succMsg: 'Hi ' + firstname + ' ' + lastname + '! Kindly check your email ' + email + ' for a message.',
                cont: 'Continue',
                errFname: '',
                errLname: '',
                errEmail: '',
                errPassword: ''
            })
        }
    }
})


// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);