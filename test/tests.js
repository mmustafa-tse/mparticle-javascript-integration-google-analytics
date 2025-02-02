/* eslint-disable no-undef*/

describe('Google Analytics Forwarder', function() {
    var MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            Commerce: 16,
        },
        CommerceEventType = {
            ProductAddToCart: 10,
            ProductRemoveFromCart: 11,
            ProductCheckout: 12,
            ProductCheckoutOption: 13,
            ProductClick: 14,
            ProductViewDetail: 15,
            ProductPurchase: 16,
            ProductRefund: 17,
            PromotionView: 18,
            PromotionClick: 19,
            ProductAddToWishlist: 20,
            ProductRemoveFromWishlist: 21,
            ProductImpression: 22,
        },
        EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            getName: function(id) {
                switch (id) {
                    case EventType.Navigation:
                        return 'Navigation';
                    case EventType.Location:
                        return 'Location';
                    case EventType.Search:
                        return 'Search';
                    case EventType.Transaction:
                        return 'Transaction';
                    case EventType.UserContent:
                        return 'User Content';
                    case EventType.UserPreference:
                        return 'User Preference';
                    case EventType.Social:
                        return 'Social';
                    case CommerceEventType.ProductAddToCart:
                        return 'Product Added to Cart';
                    case CommerceEventType.ProductAddToWishlist:
                        return 'Product Added to Wishlist';
                    case CommerceEventType.ProductCheckout:
                        return 'Product Checkout';
                    case CommerceEventType.ProductCheckoutOption:
                        return 'Product Checkout Options';
                    case CommerceEventType.ProductClick:
                        return 'Product Click';
                    case CommerceEventType.ProductImpression:
                        return 'Product Impression';
                    case CommerceEventType.ProductPurchase:
                        return 'Product Purchased';
                    case CommerceEventType.ProductRefund:
                        return 'Product Refunded';
                    case CommerceEventType.ProductRemoveFromCart:
                        return 'Product Removed From Cart';
                    case CommerceEventType.ProductRemoveFromWishlist:
                        return 'Product Removed from Wishlist';
                    case CommerceEventType.ProductViewDetail:
                        return 'Product View Details';
                    case CommerceEventType.PromotionClick:
                        return 'Promotion Click';
                    case CommerceEventType.PromotionView:
                        return 'Promotion View';
                    default:
                        return 'Other';
                }
            },
        },
        ProductActionType = {
            Unknown: 0,
            AddToCart: 1,
            RemoveFromCart: 2,
            Checkout: 3,
            CheckoutOption: 4,
            Click: 5,
            ViewDetail: 6,
            Purchase: 7,
            Refund: 8,
            AddToWishlist: 9,
            RemoveFromWishlist: 10,
        },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            Alias: 8,
            FacebookCustomAudienceId: 9,
            getName: function() {
                return 'CustomerID';
            },
        },
        PromotionActionType = {
            Unknown: 0,
            PromotionView: 1,
            PromotionClick: 2,
        },
        ReportingService = function() {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function(forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function() {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService(),
        externalUserIdentityType = {
            none: 'None',
            customerId: 'CustomerId',
            other: 'Other',
            other2: 'Other2',
            other3: 'Other3',
            other4: 'Other4',
            other5: 'Other5',
            other6: 'Other6',
            other7: 'Other7',
            other8: 'Other8',
            other9: 'Other9',
            other10: 'Other10',
        };

    before(function() {
        mParticle.EventType = EventType;
        mParticle.ProductActionType = ProductActionType;
        mParticle.PromotionType = PromotionActionType;
        mParticle.IdentityType = IdentityType;
        mParticle.getVersion = function() {
            return '2.0.1';
        };
        mParticle.Identity = {};
        mParticle.Identity.getCurrentUser = function() {
            return {
                getUserIdentities: function() {
                    return {
                        userIdentities: {
                            customerid: 'testUserId',
                        },
                    };
                },
            };
        };
        mParticle.generateHash = function(name) {
            var hash = 0,
                i = 0,
                character;

            if (!name) {
                return null;
            }

            name = name.toString().toLowerCase();

            if (Array.prototype.reduce) {
                return name.split('').reduce(function(a, b) {
                    a = (a << 5) - a + b.charCodeAt(0);
                    return a & a;
                }, 0);
            }

            if (name.length === 0) {
                return hash;
            }

            for (i = 0; i < name.length; i++) {
                character = name.charCodeAt(i);
                hash = (hash << 5) - hash + character;
                hash = hash & hash;
            }

            return hash;
        };
    });

    beforeEach(function() {
        mParticle.forwarder.init(
            {
                hashUserId: 'True',
                customDimensions:
                    '[\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 1&quot;,&quot;map&quot;:&quot;color&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 1&quot;,&quot;map&quot;:&quot;colour&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 2&quot;,&quot;map&quot;:&quot;gender&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 5&quot;,&quot;map&quot;:&quot;gender&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 5&quot;,&quot;map&quot;:&quot;sex&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 3&quot;,&quot;map&quot;:&quot;size&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Dimension 1&quot;,&quot;map&quot;:&quot;color&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Dimension 2&quot;,&quot;map&quot;:&quot;gender&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Dimension 3&quot;,&quot;map&quot;:&quot;size&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 1&quot;,&quot;map&quot;:&quot;color&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 2&quot;,&quot;map&quot;:&quot;gender&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Dimension 3&quot;,&quot;map&quot;:&quot;size&quot;}\
            ]',
                customMetrics:
                    '[\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 1&quot;,&quot;map&quot;:&quot;levels&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 2&quot;,&quot;map&quot;:&quot;shots&quot;},\
                {&quot;maptype&quot;:&quot;EventAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 3&quot;,&quot;map&quot;:&quot;players&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Metric 1&quot;,&quot;map&quot;:&quot;levels&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Metric 2&quot;,&quot;map&quot;:&quot;shots&quot;},\
                {&quot;maptype&quot;:&quot;ProductAttributeSelector.Name&quot;,&quot;value&quot;:&quot;Metric 3&quot;,&quot;map&quot;:&quot;players&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 1&quot;,&quot;map&quot;:&quot;levels&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 2&quot;,&quot;map&quot;:&quot;shots&quot;},\
                {&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;Metric 3&quot;,&quot;map&quot;:&quot;players&quot;}\
                ]',
            },
            reportService.cb,
            true,
            'tracker-name'
        );
        window.googleanalytics.reset();
        window._gaq = [];
    });

    it('should set a hashed customerid when initializing in v2', function(done) {
        window.googleanalytics.reset();

        mParticle.forwarder.init(
            {
                hashUserId: 'True',
                externalUserIdentityType: externalUserIdentityType.customerId,
            },
            reportService.cb,
            true,
            'tracker-name'
        );
        window.googleanalytics.args[1][0].should.equal('tracker-name.set');
        window.googleanalytics.args[1][1].should.equal('userId');
        (typeof window.googleanalytics.args[1][2]).should.equal('number');

        done();
    });

    it('should initialize with ampClientId if clientIdentificationType is AMP', function(done) {
        window.googleanalytics.reset();

        mParticle.forwarder.init(
            {
                clientIdentificationType: 'AMP',
            },
            reportService.cb,
            true,
            'tracker-name'
        );

        window.googleanalytics.args[0][0].should.equal('create');
        window.googleanalytics.args[0][1].should.have.properties(
            'name',
            'trackingId',
            'useAmpClientId'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'useAmpClientId',
            true
        );

        done();
    });

    it('should change page name for custom flag based on Google.Page', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'Test Page Event',
            EventAttributes: {
                anything: 'foo',
            },
            CustomFlags: {
                'Google.Page': 'foo page',
            },
        });

        window.googleanalytics.args[0][0].should.equal('tracker-name.set');
        window.googleanalytics.args[0][1].should.equal('page');
        window.googleanalytics.args[0][2].should.equal('foo page');

        done();
    });

    it('should change page name for custom flag based on Google.Title', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'Test Page Event',
            EventAttributes: {
                anything: 'foo',
            },
            CustomFlags: {
                'Google.Title': 'foo title',
            },
        });

        window.googleanalytics.args[0][0].should.equal('tracker-name.set');
        window.googleanalytics.args[0][1].should.equal('title');
        window.googleanalytics.args[0][2].should.equal('foo title');

        done();
    });

    it('should change page name for custom flag based on both Google.Page and Google.Title', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'Test Page Event',
            EventAttributes: {
                anything: 'foo',
            },
            CustomFlags: {
                'Google.Page': 'foo page',
                'Google.Title': 'foo title',
            },
        });

        window.googleanalytics.args[0][0].should.equal('tracker-name.set');
        window.googleanalytics.args[0][1].should.equal('page');
        window.googleanalytics.args[0][2].should.equal('foo page');

        window.googleanalytics.args[1][0].should.equal('tracker-name.set');
        window.googleanalytics.args[1][1].should.equal('title');
        window.googleanalytics.args[1][2].should.equal('foo title');

        done();
    });

    it('should set Page, Location, and Hostname if they are all provided via custom flags', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'Test Page Event',
            EventAttributes: {
                anything: 'foo',
            },
            CustomFlags: {
                'Google.Page': 'foo page',
                'Google.Location': 'foo location',
                'Google.Hostname': 'foo hostname'
            },
        });

        window.googleanalytics.args[0][0].should.equal('tracker-name.set');
        window.googleanalytics.args[0][1].should.equal('page');
        window.googleanalytics.args[0][2].should.equal('foo page');

        window.googleanalytics.args[1][0].should.equal('tracker-name.set');
        window.googleanalytics.args[1][1].should.equal('hostname');
        window.googleanalytics.args[1][2].should.equal('foo hostname');

        window.googleanalytics.args[2][0].should.equal('tracker-name.set');
        window.googleanalytics.args[2][1].should.equal('location');
        window.googleanalytics.args[2][2].should.equal('foo location');

        done();
    });

    it('should log custom dimensions and custom events with an event log', function(done) {
        var event = {
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category',
                gender: 'female',
                color: 'blue',
                size: 'large',
                levels: 1,
                shots: 15,
                players: 3,
            },
        };

        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('category');
        window.googleanalytics.args[0][3].should.equal('Test Event');
        window.googleanalytics.args[0][4].should.equal('label');
        window.googleanalytics.args[0][5].should.equal(200);
        window.googleanalytics.args[0][6].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[0][6].should.have.property('metric1', 1);
        window.googleanalytics.args[0][6].should.have.property('metric2', 15);
        window.googleanalytics.args[0][6].should.have.property('metric3', 3);

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };

        mParticle.forwarder.process(event);
        window.googleanalytics.args[0][1].should.equal('abcdef');

        done();
    });

    it('should log custom dimensions and metrics with a product purchase', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductPurchase,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        CouponCode: null,
                        Quantity: 1,
                        Attributes: {
                            gender: 'female',
                            color: 'blue',
                            size: 'large',
                            levels: 1,
                            shots: 15,
                            players: 3,
                        },
                    },
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null,
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[1][1].should.have.property('id', '12345');
        window.googleanalytics.args[1][1].should.have.property(
            'name',
            'iPhone 6'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'category',
            'Phones'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'brand',
            'iPhone'
        );
        window.googleanalytics.args[1][1].should.have.property('variant', '6');
        window.googleanalytics.args[1][1].should.have.property('price', 400);
        window.googleanalytics.args[1][1].should.have.property('coupon', null);
        window.googleanalytics.args[1][1].should.have.property('quantity', 1);
        window.googleanalytics.args[1][1].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[1][1].should.have.property('metric1', 1);
        window.googleanalytics.args[1][1].should.have.property('metric2', 15);
        window.googleanalytics.args[1][1].should.have.property('metric3', 3);

        window.googleanalytics.args[2][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[2][1].should.equal('purchase');
        window.googleanalytics.args[2][2].should.have.property('id', 123);
        window.googleanalytics.args[2][2].should.have.property(
            'affiliation',
            'my-affiliation'
        );
        window.googleanalytics.args[2][2].should.have.property('revenue', 450);
        window.googleanalytics.args[2][2].should.have.property('tax', 40);
        window.googleanalytics.args[2][2].should.have.property('shipping', 10);
        window.googleanalytics.args[2][2].should.have.property('coupon', null);

        window.googleanalytics.args[3][0].should.equal('tracker-name.send');
        window.googleanalytics.args[3][1].should.equal('event');
        window.googleanalytics.args[3][2].should.equal('eCommerce');
        window.googleanalytics.args[3][3].should.equal('Product Purchased');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        window.googleanalytics.args = [];

        done();
    });

    it('should log custom dimensions and metrics with a product impression', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductImpression,
            ProductImpressions: [
                {
                    ProductImpressionList: 'testImp',
                    ProductList: [
                        {
                            Sku: '12345',
                            Name: 'iPhone 6',
                            Category: 'Phones',
                            Brand: 'iPhone',
                            Variant: '6',
                            Price: 400,
                            CouponCode: null,
                            Quantity: 1,
                            Attributes: {
                                gender: 'female',
                                color: 'blue',
                                size: 'large',
                                levels: 1,
                                shots: 15,
                                players: 3,
                            },
                            TotalAmount: 100,
                        },
                    ],
                },
            ],
        };

        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addImpression'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'iPhone 6'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'category',
            'Phones'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'brand',
            'iPhone'
        );
        window.googleanalytics.args[0][1].should.have.property('variant', '6');
        window.googleanalytics.args[0][1].should.have.property('price', 400);
        window.googleanalytics.args[0][1].should.have.property('coupon', null);
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);
        window.googleanalytics.args[0][1].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'list',
            'testImp'
        );
        window.googleanalytics.args[0][1].should.have.property('metric1', 1);
        window.googleanalytics.args[0][1].should.have.property('metric2', 15);
        window.googleanalytics.args[0][1].should.have.property('metric3', 3);

        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].should.equal('event');
        window.googleanalytics.args[1][2].should.equal('eCommerce');
        window.googleanalytics.args[1][3].should.equal('Product Impression');

        done();
    });

    it('should log custom dimensions and metrics based on user attribute', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.Commerce,
            PromotionAction: {
                PromotionActionType: PromotionActionType.PromotionView,
                PromotionList: [
                    {
                        Id: 12345,
                        Creative: 'my creative',
                        Name: 'Test promotion',
                        Position: 3,
                    },
                ],
            },
            UserAttributes: {
                gender: 'female',
                color: 'blue',
                size: 'large',
                levels: 1,
                shots: 15,
                players: 3,
            },
        });

        window.googleanalytics.args[1][4].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[1][4].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[1][4].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[1][4].should.have.property('metric1', 1);
        window.googleanalytics.args[1][4].should.have.property('metric2', 15);
        window.googleanalytics.args[1][4].should.have.property('metric3', 3);
        done();
    });

    it('should allow an attribute to be mapped to multiple dimensions', function(done) {
        var event = {
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                gender: 'male',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][6].should.have.property(
            'dimension2',
            'male'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension5',
            'male'
        );

        done();
    });

    it('should allow multiple attributes to be mapped to the same dimensions', function(done) {
        var event = {
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                colour: 'blue',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][6].should.have.property(
            'dimension1',
            'blue'
        );
        var event2 = {
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                color: 'blue',
            },
        };
        mParticle.forwarder.process(event2);
        window.googleanalytics.args[1][6].should.have.property(
            'dimension1',
            'blue'
        );
        done();
    });

    it('should log events as non-interaction or interaction when provided with flag', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.Commerce,
            PromotionAction: {
                PromotionActionType: PromotionActionType.PromotionView,
                PromotionList: [
                    {
                        Id: 12345,
                        Creative: 'my creative',
                        Name: 'Test promotion',
                        Position: 3,
                    },
                ],
            },
            CustomFlags: {
                'Google.NonInteraction': true,
            },
        });

        window.googleanalytics.args[1][4].should.have.property(
            'nonInteraction',
            true
        );

        done();
    });

    it('should log event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category',
            },
        });

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('category');
        window.googleanalytics.args[0][3].should.equal('Test Event');
        window.googleanalytics.args[0][4].should.equal('label');
        window.googleanalytics.args[0][5].should.equal(200);

        done();
    });

    it('should log page view', function(done) {
        var event = {
            EventDataType: MessageType.PageView,
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('pageview');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[0][1].should.equal('abcdef');

        done();
    });

    it('should log commerce event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductPurchase,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        CouponCode: null,
                        Quantity: 1,
                    },
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null,
            },
        });

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'iPhone 6'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'category',
            'Phones'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'brand',
            'iPhone'
        );
        window.googleanalytics.args[0][1].should.have.property('variant', '6');
        window.googleanalytics.args[0][1].should.have.property('price', 400);
        window.googleanalytics.args[0][1].should.have.property('coupon', null);
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('purchase');
        window.googleanalytics.args[1][2].should.have.property('id', 123);
        window.googleanalytics.args[1][2].should.have.property(
            'affiliation',
            'my-affiliation'
        );
        window.googleanalytics.args[1][2].should.have.property('revenue', 450);
        window.googleanalytics.args[1][2].should.have.property('tax', 40);
        window.googleanalytics.args[1][2].should.have.property('shipping', 10);
        window.googleanalytics.args[1][2].should.have.property('coupon', null);

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Purchased');

        done();
    });

    it('should log refund', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductRefund,
            ProductAction: {
                ProductActionType: ProductActionType.Refund,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
                TransactionId: 123,
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('refund');
        window.googleanalytics.args[1][2].should.have.property('id', 123);

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Refunded');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('should log add to cart', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductAddToCart,
            ProductAction: {
                ProductActionType: ProductActionType.AddToCart,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('add');

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Added to Cart');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('should log remove from cart', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductRemoveFromCart,
            ProductAction: {
                ProductActionType: ProductActionType.RemoveFromCart,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
            },
        };

        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('remove');

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal(
            'Product Removed From Cart'
        );

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('should log checkout', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductCheckout,
            ProductAction: {
                ProductActionType: ProductActionType.Checkout,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
                CheckoutStep: 1,
                CheckoutOptions: 'Visa',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('checkout');
        window.googleanalytics.args[1][2].should.have.property('step', 1);
        window.googleanalytics.args[1][2].should.have.property(
            'option',
            'Visa'
        );

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Checkout');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('should log a checkout option', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventAttributes: {
                step: 1,
                option: 'fedex',
            },
            EventCategory: CommerceEventType.ProductCheckout,
            ProductAction: {
                ProductActionType: ProductActionType.CheckoutOption,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
            },
        };

        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('checkout_option');
        window.googleanalytics.args[1][2].should.have.property('step', 1);
        window.googleanalytics.args[1][2].should.have.property(
            'option',
            'fedex'
        );

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Checkout');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('should log product click', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductClick,
            ProductAction: {
                ProductActionType: ProductActionType.Click,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('click');

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Click');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('it should log product view detail', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductViewDetail,
            ProductAction: {
                ProductActionType: ProductActionType.ViewDetail,
                ProductList: [
                    {
                        Sku: '12345',
                        Quantity: 1,
                    },
                ],
            },
        };

        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('detail');

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product View Details');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[2][1].should.equal('abcdef');

        done();
    });

    it('it should log product impressions', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductImpression,
            ProductImpressions: [
                {
                    ProductImpressionList: 'Test',
                    ProductList: [
                        {
                            Sku: '12345',
                            Name: 'iPhone 6',
                            Category: 'Phones',
                            Brand: 'iPhone',
                            Variant: 'S',
                        },
                    ],
                },
            ],
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addImpression'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'iPhone 6'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'category',
            'Phones'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'brand',
            'iPhone'
        );
        window.googleanalytics.args[0][1].should.have.property('variant', 'S');

        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].should.equal('event');
        window.googleanalytics.args[1][2].should.equal('eCommerce');
        window.googleanalytics.args[1][3].should.equal('Product Impression');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[1][1].should.equal('abcdef');

        done();
    });

    // setUserIdentity is only on MP.js version 1.x
    it('it should set user identity', function(done) {
        var getVersionBackup = mParticle.getVersion;
        mParticle.getVersion = function() {
            return '1.0.0';
        };

        mParticle.forwarder.setUserIdentity(
            'tbreffni@mparticle.com',
            IdentityType.CustomerId
        );

        window.googleanalytics.args[0][0].should.equal('tracker-name.set');
        window.googleanalytics.args[0][1].should.equal('userId');
        window.googleanalytics.args[0][2].should.equal(
            mParticle.generateHash('tbreffni@mparticle.com')
        );

        mParticle.getVersion = getVersionBackup;

        done();
    });

    it('should log promotion view', function(done) {
        var event = {
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.PromotionView,
            PromotionAction: {
                PromotionActionType: PromotionActionType.PromotionView,
                PromotionList: [
                    {
                        Id: 12345,
                        Creative: 'my creative',
                        Name: 'Test promotion',
                        Position: 3,
                    },
                ],
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addPromo'
        );
        window.googleanalytics.args[0][1].should.have.property('id', 12345);
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'Test promotion'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'creative',
            'my creative'
        );
        window.googleanalytics.args[0][1].should.have.property('position', 3);

        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].should.equal('event');
        window.googleanalytics.args[1][2].should.equal('eCommerce');
        window.googleanalytics.args[1][3].should.equal('Promotion View');

        window.googleanalytics.args = [];

        event.CustomFlags = { 'Google.HitType': 'abcdef' };
        mParticle.forwarder.process(event);
        window.googleanalytics.args[1][1].should.equal('abcdef');

        done();
    });

    it('should log promotion click', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.PromotionClick,
            PromotionAction: {
                PromotionActionType: PromotionActionType.PromotionClick,
                PromotionList: [
                    {
                        Id: 12345,
                        Creative: 'my creative',
                        Name: 'Test promotion',
                        Position: 3,
                    },
                ],
            },
        });

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addPromo'
        );
        window.googleanalytics.args[0][1].should.have.property('id', 12345);
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'Test promotion'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'creative',
            'my creative'
        );
        window.googleanalytics.args[0][1].should.have.property('position', 3);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('promo_click');

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Promotion Click');

        done();
    });

    it('should log page event along with user timing event when custom flags are passed', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Page Event',
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
                'Google.Category': 'Custom Category',
            },
            EventCategory: EventType.Location,
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category',
                gender: 'female',
                color: 'blue',
                size: 'large',
                levels: 1,
                shots: 15,
                players: 3,
            },
        });

        // regular GA event
        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('Custom Category');
        window.googleanalytics.args[0][3].should.equal('Test Page Event');
        window.googleanalytics.args[0][4].should.equal('Custom Label');
        window.googleanalytics.args[0][5].should.equal(200);
        window.googleanalytics.args[0][6].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[0][6].should.have.property('metric1', 1);
        window.googleanalytics.args[0][6].should.have.property('metric2', 15);
        window.googleanalytics.args[0][6].should.have.property('metric3', 3);

        // user timing event
        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].hitType.should.equal('timing');
        window.googleanalytics.args[1][1].timingCategory.should.equal(
            'Custom Category'
        );
        window.googleanalytics.args[1][1].timingValue.should.equal(500);
        window.googleanalytics.args[1][1].timingLabel.should.equal(
            'Custom Label'
        );
        window.googleanalytics.args[1][1].timingVar.should.equal(
            'Test Page Event'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[1][1].should.have.property('metric1', 1);
        window.googleanalytics.args[1][1].should.have.property('metric2', 15);
        window.googleanalytics.args[1][1].should.have.property('metric3', 3);
        done();
    });

    it('should log regular page event along with user timing event when custom flags are passed ', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Page Event',
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
                'Google.Category': 'Custom Category',
            },
            EventCategory: EventType.Location,
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category',
                gender: 'female',
                color: 'blue',
                size: 'large',
                levels: 1,
                shots: 15,
                players: 3,
            },
        });

        // regular GA event
        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('Custom Category');
        window.googleanalytics.args[0][3].should.equal('Test Page Event');
        window.googleanalytics.args[0][4].should.equal('Custom Label');
        window.googleanalytics.args[0][5].should.equal(200);
        window.googleanalytics.args[0][6].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[0][6].should.have.property('metric1', 1);
        window.googleanalytics.args[0][6].should.have.property('metric2', 15);
        window.googleanalytics.args[0][6].should.have.property('metric3', 3);

        // user timing event
        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].hitType.should.equal('timing');
        window.googleanalytics.args[1][1].timingCategory.should.equal(
            'Custom Category'
        );
        window.googleanalytics.args[1][1].timingValue.should.equal(500);
        window.googleanalytics.args[1][1].timingLabel.should.equal(
            'Custom Label'
        );
        window.googleanalytics.args[1][1].timingVar.should.equal(
            'Test Page Event'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension1',
            'blue'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension2',
            'female'
        );
        window.googleanalytics.args[1][1].should.have.property(
            'dimension3',
            'large'
        );
        window.googleanalytics.args[1][1].should.have.property('metric1', 1);
        window.googleanalytics.args[1][1].should.have.property('metric2', 15);
        window.googleanalytics.args[1][1].should.have.property('metric3', 3);

        done();
    });

    it('should log page view along with user timing event when custom flags are passed', function(done) {
        var event = {
            EventName: 'PageView',
            EventDataType: MessageType.PageView,
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
                'Google.Category': 'Custom Category',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('pageview');

        // user timing event
        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].hitType.should.equal('timing');
        window.googleanalytics.args[1][1].timingCategory.should.equal(
            'Custom Category'
        );
        window.googleanalytics.args[1][1].timingValue.should.equal(500);
        window.googleanalytics.args[1][1].timingLabel.should.equal(
            'Custom Label'
        );
        window.googleanalytics.args[1][1].timingVar.should.equal('PageView');

        done();
    });

    it('should log page view along with user timing event when custom flags are passed', function(done) {
        var event = {
            EventName: 'PageView',
            EventDataType: MessageType.PageView,
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
                'Google.Category': 'Custom Category',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('pageview');

        // user timing event
        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].hitType.should.equal('timing');
        window.googleanalytics.args[1][1].timingCategory.should.equal(
            'Custom Category'
        );
        window.googleanalytics.args[1][1].timingValue.should.equal(500);
        window.googleanalytics.args[1][1].timingLabel.should.equal(
            'Custom Label'
        );
        window.googleanalytics.args[1][1].timingVar.should.equal('PageView');

        done();
    });

    it('should log commerce event along with user timing event when custom flags are passed ', function(done) {
        mParticle.forwarder.process({
            EventName: 'eCommerce - Purchase',
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductPurchase,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        CouponCode: null,
                        Quantity: 1,
                    },
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null,
            },
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
                'Google.Category': 'Custom Category',
            },
        });

        window.googleanalytics.args[0][0].should.equal(
            'tracker-name.ec:addProduct'
        );
        window.googleanalytics.args[0][1].should.have.property('id', '12345');
        window.googleanalytics.args[0][1].should.have.property(
            'name',
            'iPhone 6'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'category',
            'Phones'
        );
        window.googleanalytics.args[0][1].should.have.property(
            'brand',
            'iPhone'
        );
        window.googleanalytics.args[0][1].should.have.property('variant', '6');
        window.googleanalytics.args[0][1].should.have.property('price', 400);
        window.googleanalytics.args[0][1].should.have.property('coupon', null);
        window.googleanalytics.args[0][1].should.have.property('quantity', 1);

        window.googleanalytics.args[1][0].should.equal(
            'tracker-name.ec:setAction'
        );
        window.googleanalytics.args[1][1].should.equal('purchase');
        window.googleanalytics.args[1][2].should.have.property('id', 123);
        window.googleanalytics.args[1][2].should.have.property(
            'affiliation',
            'my-affiliation'
        );
        window.googleanalytics.args[1][2].should.have.property('revenue', 450);
        window.googleanalytics.args[1][2].should.have.property('tax', 40);
        window.googleanalytics.args[1][2].should.have.property('shipping', 10);
        window.googleanalytics.args[1][2].should.have.property('coupon', null);

        window.googleanalytics.args[2][0].should.equal('tracker-name.send');
        window.googleanalytics.args[2][1].should.equal('event');
        window.googleanalytics.args[2][2].should.equal('eCommerce');
        window.googleanalytics.args[2][3].should.equal('Product Purchased');

        // user timing event
        window.googleanalytics.args[3][0].should.equal('tracker-name.send');
        window.googleanalytics.args[3][1].hitType.should.equal('timing');
        window.googleanalytics.args[3][1].timingCategory.should.equal(
            'Custom Category'
        );
        window.googleanalytics.args[3][1].timingValue.should.equal(500);
        window.googleanalytics.args[3][1].timingLabel.should.equal(
            'Custom Label'
        );
        window.googleanalytics.args[3][1].timingVar.should.equal(
            'eCommerce - Purchase'
        );

        done();
    });

    it("should not log a user timing event if Google.UserTiming is not of type 'number'", function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Page Event',
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': '500',
                'Google.Category': 'Custom Category',
            },
            EventCategory: EventType.Location,
        });

        // regular GA event
        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('Custom Category');
        window.googleanalytics.args[0][3].should.equal('Test Page Event');
        window.googleanalytics.args[0][4].should.equal('Custom Label');

        // user timing event should not exist
        window.googleanalytics.args.length.should.equal(1);

        done();
    });

    it('should pass EventCategory to a user timing event if Google.Category custom flag not passed', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Page Event',
            CustomFlags: {
                'Google.Label': 'Custom Label',
                'Google.UserTiming': 500,
            },
            EventCategory: EventType.Location,
        });

        // regular GA event
        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('Location');
        window.googleanalytics.args[0][3].should.equal('Test Page Event');
        window.googleanalytics.args[0][4].should.equal('Custom Label');

        // user timing event should not exist
        window.googleanalytics.args[1][0].should.equal('tracker-name.send');
        window.googleanalytics.args[1][1].hitType.should.equal('timing');
        window.googleanalytics.args[1][1].timingCategory.should.equal(
            'Location'
        );

        done();
    });

    it('should set a content group on a page view when customFlags are set', function(done) {
        var event = {
            EventDataType: MessageType.PageView,
            CustomFlags: {
                'Google.CG1': 'value1',
                'Google.CG2': 'value2',
                'Google.CG3': 'value3',
                'Google.CG4': 'value4',
                'Google.CG5': 'value5',
            },
        };
        mParticle.forwarder.process(event);

        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('pageview');
        window.googleanalytics.args[0][2].should.have.property(
            'contentGroup1',
            'value1'
        );
        window.googleanalytics.args[0][2].should.have.property(
            'contentGroup2',
            'value2'
        );
        window.googleanalytics.args[0][2].should.have.property(
            'contentGroup3',
            'value3'
        );
        window.googleanalytics.args[0][2].should.have.property(
            'contentGroup4',
            'value4'
        );
        window.googleanalytics.args[0][2].should.have.property(
            'contentGroup5',
            'value5'
        );

        done();
    });

    it('should set a content group on a regular event log when customFlags are set', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Page Event',
            CustomFlags: {
                'Google.CG1': 'value1',
                'Google.CG2': 'value2',
                'Google.CG3': 'value3',
                'Google.CG4': 'value4',
                'Google.CG5': 'value5',
            },
            EventCategory: EventType.Location,
        });
        window.googleanalytics.args[0][0].should.equal('tracker-name.send');
        window.googleanalytics.args[0][1].should.equal('event');
        window.googleanalytics.args[0][2].should.equal('Location');
        window.googleanalytics.args[0][3].should.equal('Test Page Event');
        window.googleanalytics.args[0][6].should.have.property(
            'contentGroup1',
            'value1'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'contentGroup2',
            'value2'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'contentGroup3',
            'value3'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'contentGroup4',
            'value4'
        );
        window.googleanalytics.args[0][6].should.have.property(
            'contentGroup5',
            'value5'
        );

        done();
    });

    it('should set a content group on a commerce event log when customFlags are set', function(done) {
        mParticle.forwarder.process({
            EventName: 'eCommerce - Purchase',
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductPurchase,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        CouponCode: null,
                        Quantity: 1,
                    },
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null,
            },
            CustomFlags: {
                'Google.CG1': 'value1',
                'Google.CG2': 'value2',
                'Google.CG3': 'value3',
                'Google.CG4': 'value4',
                'Google.CG5': 'value5',
            },
        });

        window.googleanalytics.args[2][4].should.have.property(
            'contentGroup1',
            'value1'
        );
        window.googleanalytics.args[2][4].should.have.property(
            'contentGroup2',
            'value2'
        );
        window.googleanalytics.args[2][4].should.have.property(
            'contentGroup3',
            'value3'
        );
        window.googleanalytics.args[2][4].should.have.property(
            'contentGroup4',
            'value4'
        );
        window.googleanalytics.args[2][4].should.have.property(
            'contentGroup5',
            'value5'
        );

        done();
    });

    describe('ContentGroup tests to be deprecated on 3/1/2021', function() {
        it('should set a content group when initialized with the proper custom flags', function(done) {
            window.googleanalytics.reset();

            mParticle.forwarder.init(
                {
                    clientIdentificationType: 'AMP',
                },
                reportService.cb,
                true,
                'tracker-name',
                null,
                null,
                null,
                null,
                {
                    'Google.CGNumber': '5',
                    'Google.CGValue': '/abc/def/',
                }
            );

            window.googleanalytics.args[0][0].should.equal('create');
            window.googleanalytics.args[1][0].should.equal('tracker-name.set');
            window.googleanalytics.args[1][1].should.equal('contentGroup5');
            window.googleanalytics.args[1][2].should.equal('/abc/def/');

            done();
        });

        it('should set a content group on a regular event log when customFlags are set', function(done) {
            mParticle.forwarder.process({
                EventDataType: MessageType.PageEvent,
                EventName: 'Test Page Event',
                CustomFlags: {
                    'Google.CGNumber': '3',
                    'Google.CGValue': 'abc',
                },
                EventCategory: EventType.Location,
            });

            window.googleanalytics.args[0][0].should.equal('tracker-name.set');
            window.googleanalytics.args[0][1].should.equal('contentGroup3');
            window.googleanalytics.args[0][2].should.equal('abc');

            window.googleanalytics.args[1][0].should.equal('tracker-name.send');
            window.googleanalytics.args[1][1].should.equal('event');
            window.googleanalytics.args[1][2].should.equal('Location');
            window.googleanalytics.args[1][3].should.equal('Test Page Event');

            done();
        });

        it('should set a content group on a commerce event log when customFlags are set', function(done) {
            mParticle.forwarder.process({
                EventName: 'eCommerce - Purchase',
                EventDataType: MessageType.Commerce,
                EventCategory: CommerceEventType.ProductPurchase,
                ProductAction: {
                    ProductActionType: ProductActionType.Purchase,
                    ProductList: [
                        {
                            Sku: '12345',
                            Name: 'iPhone 6',
                            Category: 'Phones',
                            Brand: 'iPhone',
                            Variant: '6',
                            Price: 400,
                            CouponCode: null,
                            Quantity: 1,
                        },
                    ],
                    TransactionId: 123,
                    Affiliation: 'my-affiliation',
                    TotalAmount: 450,
                    TaxAmount: 40,
                    ShippingAmount: 10,
                    CouponCode: null,
                },
                CustomFlags: {
                    'Google.CGNumber': '2',
                    'Google.CGValue': 'abc',
                },
            });

            window.googleanalytics.args[0][0].should.equal('tracker-name.set');
            window.googleanalytics.args[0][1].should.equal('contentGroup2');
            window.googleanalytics.args[0][2].should.equal('abc');

            done();
        });

        it('should set a content group on a page view when customFlags are set', function(done) {
            var event = {
                EventDataType: MessageType.PageView,
                CustomFlags: {
                    'Google.CGNumber': '2',
                    'Google.CGValue': 'abc',
                },
            };
            mParticle.forwarder.process(event);

            window.googleanalytics.args[0][0].should.equal('tracker-name.set');
            window.googleanalytics.args[0][1].should.equal('contentGroup2');
            window.googleanalytics.args[0][2].should.equal('abc');

            window.googleanalytics.args[1][0].should.equal('tracker-name.send');
            window.googleanalytics.args[1][1].should.equal('pageview');

            done();
        });
    });

    it('should not hash a user id when hashUserId is false', function(done) {
        window.googleanalytics.reset();

        mParticle.forwarder.init(
            {
                hashUserId: 'False',
                externalUserIdentityType: externalUserIdentityType.customerId,
            },
            reportService.cb,
            true,
            'tracker-name'
        );
        window.googleanalytics.args[1][0].should.equal('tracker-name.set');
        window.googleanalytics.args[1][1].should.equal('userId');

        window.googleanalytics.args[1][2].should.equal(
            mParticle.Identity.getCurrentUser().getUserIdentities()
                .userIdentities.customerid
        );

        done();
    });

    it('should set the proper Other external user identity type', function(done) {
        function resetAndInitGA(userIdType) {
            window.googleanalytics.reset();
            mParticle.forwarder.init(
                {
                    hashUserId: 'False',
                    externalUserIdentityType: userIdType,
                },
                reportService.cb,
                true,
                'tracker-name'
            );
        }

        mParticle.Identity.getCurrentUser = function() {
            return {
                getUserIdentities: function() {
                    return {
                        userIdentities: {
                            other: 'other',
                            other2: 'other2',
                            other3: 'other3',
                            other4: 'other4',
                            other5: 'other5',
                            other6: 'other6',
                            other7: 'other7',
                            other8: 'other8',
                            other9: 'other9',
                            other10: 'other10',
                        },
                    };
                },
            };
        };

        var otherIds = mParticle.Identity.getCurrentUser().getUserIdentities()
            .userIdentities;
        var other1 = otherIds.other;
        var other2 = otherIds.other2;
        var other3 = otherIds.other3;
        var other4 = otherIds.other4;
        var other5 = otherIds.other5;
        var other6 = otherIds.other6;
        var other7 = otherIds.other7;
        var other8 = otherIds.other8;
        var other9 = otherIds.other9;
        var other10 = otherIds.other10;

        resetAndInitGA(externalUserIdentityType.other);
        window.googleanalytics.args[1][2].should.equal(other1);

        resetAndInitGA(externalUserIdentityType.other2);
        window.googleanalytics.args[1][2].should.equal(other2);

        resetAndInitGA(externalUserIdentityType.other3);
        window.googleanalytics.args[1][2].should.equal(other3);

        resetAndInitGA(externalUserIdentityType.other4);
        window.googleanalytics.args[1][2].should.equal(other4);

        resetAndInitGA(externalUserIdentityType.other5);
        window.googleanalytics.args[1][2].should.equal(other5);

        resetAndInitGA(externalUserIdentityType.other6);
        window.googleanalytics.args[1][2].should.equal(other6);

        resetAndInitGA(externalUserIdentityType.other7);
        window.googleanalytics.args[1][2].should.equal(other7);

        resetAndInitGA(externalUserIdentityType.other8);
        window.googleanalytics.args[1][2].should.equal(other8);

        resetAndInitGA(externalUserIdentityType.other9);
        window.googleanalytics.args[1][2].should.equal(other9);

        resetAndInitGA(externalUserIdentityType.other10);
        window.googleanalytics.args[1][2].should.equal(other10);

        done();
    });
});
