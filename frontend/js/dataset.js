/**
 * NyBasket – Static Dataset & Seed Generator for Browser / Netlify
 * Provides initial realistic data for products, customers, orders, order items & returns.
 */

(function(root) {
    const CATEGORIES_DATA = {
        "Electronics": [
            ["Aura Wireless Noise-Cancelling Headphones", 4999.0, 2499.0, 4.8, 142, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", "High-fidelity sound with 35dB active noise cancellation and 40-hour battery life."],
            ["Pulse Pro Smartwatch Series 7", 3499.0, 1650.0, 4.6, 98, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80", "AMOLED display with continuous heart rate, SpO2 tracking, and IP68 water resistance."],
            ["UltraVision 4K Action Camera Pro", 7999.0, 4200.0, 4.5, 65, "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80", "Smooth 4K 60FPS video recording with 6-axis gyro stabilization and dual screens."],
            ["MechStrike RGB Mechanical Gaming Keyboard", 2899.0, 1300.0, 4.7, 115, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80", "Custom blue tactile switches, per-key RGB backlighting, and aircraft-grade aluminum top plate."],
            ["BoomSound 360 Portable Bluetooth Speaker", 1999.0, 850.0, 4.4, 88, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80", "Deep bass with 24W output, IPX7 waterproof rating, and TWS stereo pairing."],
            ["NovaPower 65W GaN Fast Charger", 1499.0, 580.0, 4.9, 210, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80", "Ultra-compact dual USB-C & USB-A fast charger for laptops, tablets, and phones."],
            ["ErgoGrip Wireless Vertical Mouse", 1299.0, 520.0, 4.3, 74, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80", "Ergonomic 57-degree vertical design reducing forearm strain with 2.4G & Bluetooth multi-device support."],
            ["SonicBuds Pro TWS Earbuds", 2299.0, 980.0, 4.5, 185, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80", "Crystal clear calls with quad MEMS microphones and 30-hour playback with fast charging."],
            ["HyperHub 9-in-1 USB-C Docking Hub", 2799.0, 1250.0, 4.6, 52, "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80", "4K HDMI, Gigabit Ethernet, 100W PD charging, SD/TF card reader, and 3x USB 3.0 ports."],
            ["SmartView 360 WiFi Security Camera", 2499.0, 1100.0, 4.4, 91, "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80", "Full HD 1080p pan/tilt with AI human detection, two-way audio, and infrared night vision."],
            ["AirFlow Dual Band WiFi 6 Router", 3999.0, 1950.0, 4.7, 44, "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop&q=80", "Next-gen WiFi 6 speeds up to 1800 Mbps with 4 high-gain antennas and OFDMA technology."],
            ["Titanium PowerBank 20,000mAh 22.5W", 1899.0, 790.0, 4.8, 160, "https://images.unsplash.com/photo-1609592426505-ea65415bc217?w=600&auto=format&fit=crop&q=80", "High capacity flight-approved power bank with LED percentage display and Quick Charge 3.0."],
            ["ClarityView 27\" QHD IPS Monitor", 16999.0, 11500.0, 4.7, 38, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80", "2560x1440 IPS panel with 100% sRGB color gamut, 75Hz refresh rate, and ultra-thin bezels."],
            ["VocalMaster USB Condenser Studio Mic", 3499.0, 1450.0, 4.6, 73, "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80", "Cardioid polar pattern studio microphone with real-time headphone monitor and pop filter."],
            ["GlideTouch Precision Stylus Pen", 1599.0, 620.0, 4.3, 49, "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80", "Palm rejection and tilt sensitivity for iPad and capacitive touch screen devices."],
            ["StreamDeck Multi-Key Macro Pad", 4999.0, 2300.0, 4.5, 31, "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80", "15 customizable LCD keys for streaming, coding shortcuts, and content creation workflow."],
            ["SoundBar Cinema 120W with Subwoofer", 6999.0, 3600.0, 4.6, 58, "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80", "Dolby Audio compatible 2.1 channel soundbar with wireless subwoofer and optical input."],
            ["AeroCool Laptop Cooling Pad RGB", 1299.0, 480.0, 4.2, 85, "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80", "6 high-speed silent fans with adjustable angle stand and dual USB ports."],
            ["VisionGlass 1080p Smart Home Projector", 8999.0, 4500.0, 4.7, 49, "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80", "Mini cinema projector with built-in Android TV, WiFi and Bluetooth support."],
            ["ChargeStand 3-in-1 Wireless Charging Station", 2199.0, 890.0, 4.5, 94, "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80", "Simultaneous fast inductive charging for Phone, Smartwatch, and Wireless Earbuds."]
        ],
        "Fashion": [
            ["Oxford Slim-Fit Pure Cotton Shirt", 1299.0, 520.0, 4.5, 120, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80", "Premium breathable combed cotton tailored shirt for business and casual wear."],
            ["Vintage Distressed Denim Jacket", 2499.0, 1050.0, 4.7, 85, "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80", "Heavyweight 100% cotton denim jacket with antique brass buttons and chest pockets."],
            ["AeroStride Breathable Running Shoes", 2999.0, 1250.0, 4.6, 175, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", "Ultra-lightweight mesh upper with responsive EVA cushioning for maximum comfort."],
            ["Aviator Polarized Classic Sunglasses", 999.0, 320.0, 4.4, 94, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80", "UV400 protection with anti-glare polarized lenses and durable metal frame."],
            ["Heritage Top-Grain Leather Bifold Wallet", 799.0, 260.0, 4.8, 140, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80", "Handcrafted genuine leather wallet with RFID blocking layer and 8 card slots."],
            ["ProFit Athletic Training Joggers", 1199.0, 450.0, 4.5, 110, "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80", "4-way stretch moisture-wicking fabric with zippered utility pockets and tapered cuff."],
            ["StormShield Lightweight Windbreaker Jacket", 1999.0, 780.0, 4.6, 68, "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80", "Water-repellent and windproof hooded jacket that packs into its own pocket."],
            ["UrbanExplorer Waterproof Canvas Backpack", 1899.0, 720.0, 4.7, 130, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80", "Padded compartment for 15.6\" laptop, hidden anti-theft pocket, and USB charging port."],
            ["Minimalist Chronograph Mesh Watch", 2299.0, 890.0, 4.6, 76, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80", "Sleek stainless steel mesh band with Japanese quartz movement and scratch-resistant sapphire glass."],
            ["Botanical Printed Summer Maxi Dress", 1799.0, 680.0, 4.4, 55, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80", "Flowy rayon fabric with vibrant floral print, elasticated waist, and tiered hem."],
            ["SmartFlex Stretch Chino Trousers", 1499.0, 580.0, 4.5, 92, "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80", "Wrinkle-resistant cotton blend stretch chinos with clean tailored cut."],
            ["ThermalLite Puffer Quilted Vest", 1699.0, 640.0, 4.3, 47, "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80", "Insulated lightweight sleeveless puffer vest with high collar and fleece-lined pockets."],
            ["Everyday Canvas Slip-On Sneakers", 1299.0, 490.0, 4.4, 82, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80", "Casual slip-on canvas shoes with cushioned memory foam insole and vulcanized rubber sole."],
            ["Boho Embroidered Cotton Kurti", 1199.0, 430.0, 4.6, 64, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80", "Fine handcrafted embroidery on pure breathable cotton for ethnic festive and office styling."],
            ["Silk Touch Printed Square Scarf", 599.0, 180.0, 4.7, 43, "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80", "Luxurious silk-feel lightweight printed scarf for versatile neck and hair styling."],
            ["Classic Heavyweight Crewneck Sweatshirt", 1399.0, 510.0, 4.5, 89, "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80", "Brushed fleece interior for cozy warmth with ribbed collar, cuffs, and hem."],
            ["Urban Streetwear Oversized Graphic Hoodie", 1899.0, 710.0, 4.7, 102, "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80", "Drop shoulder heavy cotton hoodie with modern typography print."],
            ["Classic Leather Dress Belt Reversible", 699.0, 220.0, 4.6, 114, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80", "2-in-1 reversible black/brown genuine leather belt with rotating alloy buckle."],
            ["Merino Wool Blend Thermal Beanie", 499.0, 160.0, 4.8, 93, "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop&q=80", "Soft itch-free rib-knitted merino wool beanie cap for winter styling."]
        ],
        "Home & Kitchen": [
            ["GrandMaster 6-Piece Japanese Chef Knife Set", 3999.0, 1600.0, 4.8, 95, "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80", "High carbon stainless steel blades with ergonomic pakkawood handles and acrylic stand."],
            ["CrispAir Digital Smart Air Fryer 5.5L", 4999.0, 2200.0, 4.7, 134, "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80", "Rapid 360-degree hot air circulation with 8 one-touch cooking presets and non-stick basket."],
            ["GraniteStone 5-Piece Ceramic Cookware Set", 4499.0, 1950.0, 4.6, 82, "https://images.unsplash.com/photo-1584990347449-389f417122df?w=600&auto=format&fit=crop&q=80", "Toxin-free 100% PFOA/PTFE free mineral ceramic non-stick frying pans and saucepans."],
            ["PrecisionTemp Stainless Steel Electric Kettle", 1899.0, 750.0, 4.5, 112, "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80", "1.7L capacity with 6 temperature presets, 30-minute keep warm mode, and double-wall cool touch."],
            ["TheraSnooze Memory Foam Orthopedic Pillow", 1499.0, 560.0, 4.7, 145, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80", "Contoured cervical support pillow with cooling gel layer and washable bamboo cover."],
            ["RoboClean AI Robot Vacuum & Mop", 14999.0, 8900.0, 4.6, 42, "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80", "2800Pa suction power with LiDAR laser navigation, app mapping, and automated floor mopping."],
            ["RoyalPorcelain 16-Piece Dinnerware Set", 3299.0, 1380.0, 4.7, 56, "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80", "Chip-resistant fine porcelain service for 4, microwave and dishwasher safe."],
            ["Artisan Cold Brew Iced Coffee Maker 1L", 1299.0, 480.0, 4.5, 68, "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80", "Borosilicate glass carafe with ultra-fine stainless steel mesh filter and airtight silicone seal."],
            ["ZenAroma Ultrasonic Essential Oil Diffuser", 1199.0, 420.0, 4.6, 99, "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80", "500ml capacity with 7 ambient LED colors, auto-shutoff timer, and silent ultrasonic mist."],
            ["EcoBamboo Organic Cutting Board 3-Piece", 999.0, 360.0, 4.8, 128, "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80", "Natural antimicrobial organic bamboo boards with deep juice grooves and side handles."],
            ["FreshLock 8-Piece Borosilicate Glass Containers", 1699.0, 680.0, 4.7, 105, "https://images.unsplash.com/photo-1584990347449-a2e6f4a86d26?w=600&auto=format&fit=crop&q=80", "Airtight snap-lock lids, leakproof, oven-safe up to 400°C, freezer and microwave friendly."],
            ["AeroBlend High-Speed Nutri Blender 900W", 2799.0, 1150.0, 4.5, 77, "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80", "Stainless steel extractor blades with 2 BPA-free travel cups for smoothies and nut butter."],
            ["CastIron Pre-Seasoned Skillet 10.5 Inch", 1399.0, 520.0, 4.8, 118, "https://images.unsplash.com/photo-1584990347449-389f417122df?w=600&auto=format&fit=crop&q=80", "Heavy-duty cast iron for superior heat retention, perfect for searing, baking, and frying."],
            ["LuxeVelvet Blackout Window Curtains (Pair)", 1799.0, 690.0, 4.4, 62, "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80", "100% room darkening thermal insulated velvet drapery with stainless steel grommets."],
            ["AromaBake Silicone Non-Stick Baking Mat Set", 699.0, 240.0, 4.6, 73, "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80", "Food-grade silicone pastry and cookie baking sheets, heat resistant from -40°C to 250°C."],
            ["PureDrop Multi-Stage Faucet Water Filter", 1299.0, 470.0, 4.3, 51, "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80", "7-layer ceramic activated carbon filter removing 99% chlorine, heavy metals, and rust."],
            ["SmartSensor Automatic Trash Can 12L", 2199.0, 880.0, 4.5, 65, "https://images.unsplash.com/photo-1584990347449-389f417122df?w=600&auto=format&fit=crop&q=80", "Touchless infrared motion sensor lid with odor filter and stainless steel body."],
            ["Handcrafted Jute Round Area Rug 4ft", 1499.0, 560.0, 4.6, 84, "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80", "100% eco-friendly natural braided jute rug for living room and bedroom."]
        ],
        "Beauty": [
            ["GlowMatrix 20% Vitamin C + Ferulic Serum", 799.0, 240.0, 4.8, 230, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80", "Brightening facial serum targeting hyperpigmentation, dark spots, and boosting collagen."],
            ["HydroBoost 2% Multi-Molecular Hyaluronic Cream", 699.0, 210.0, 4.7, 180, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80", "Ultra-lightweight gel cream delivering 72-hour deep moisture barrier replenishment."],
            ["ClearPore Gentle Salicylic Acid Cleanser", 499.0, 145.0, 4.6, 160, "https://images.unsplash.com/photo-1556228722-d0b5d034ab3d?w=600&auto=format&fit=crop&q=80", "Non-drying foaming daily face wash with 2% BHA and niacinamide to unclog pores."],
            ["VelvetMatte Long-Lasting Liquid Lipstick Set", 899.0, 280.0, 4.5, 115, "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80", "Transfer-proof 12-hour matte finish enriched with vitamin E and jojoba oil (3 shades)."],
            ["Moroccan Argan Liquid Gold Hair Serum", 999.0, 310.0, 4.8, 142, "https://images.unsplash.com/photo-1608248597359-5974c86de1a4?w=600&auto=format&fit=crop&q=80", "100% pure cold-pressed argan oil with keratin for frizzy hair repair and thermal protection."],
            ["RoseDew Organic Bulgarian Rose Mist Toner", 549.0, 160.0, 4.7, 89, "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80", "Steam-distilled pure rose water for instant skin soothing and pH balancing."],
            ["SunDefend Invisible Fluid Sunscreen SPF 50+", 649.0, 190.0, 4.9, 275, "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80", "Ultra-lightweight zero white cast SPF 50+ PA++++ broad spectrum matte sunscreen."],
            ["DetoxCharcoal Bamboo Face & Body Clay Mask", 599.0, 175.0, 4.5, 96, "https://images.unsplash.com/photo-1567928815104-b7980ee5032e?w=600&auto=format&fit=crop&q=80", "Activated bamboo charcoal and French kaolin clay for deep pore detox and blackhead removal."],
            ["PeptideFirm Collagen Eye Repair Gel", 849.0, 260.0, 4.6, 78, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80", "Caffeine and peptide complex reduces morning puffiness, dark circles, and fine lines."],
            ["Arabica Coffee Exfoliating Body Scrub", 499.0, 150.0, 4.7, 122, "https://images.unsplash.com/photo-1608248597359-5974c86de1a4?w=600&auto=format&fit=crop&q=80", "Freshly roasted ground Arabica coffee and brown sugar with coconut oil for smooth glowing skin."],
            ["BioNourish Castor & Rosemary Lash Serum", 599.0, 170.0, 4.4, 65, "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80", "Natural botanical lash and brow growth serum with fine precision applicator."],
            ["Botanical Therapy Anti-Dandruff Scalp Tonic", 699.0, 215.0, 4.5, 54, "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80", "Tea tree and salicylic acid scalp treatment to eliminate flaking and soothe itchiness."],
            ["LuxeSilk Overnight Collagen Sleeping Mask", 899.0, 290.0, 4.7, 98, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80", "Intensive overnight skin firming and plumping treatment with ceramides and marine peptides."],
            ["NourishGlow Tinted Lip Oil with Vitamin E", 399.0, 110.0, 4.6, 140, "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80", "Non-sticky sheer cherry gloss infused with berry extracts and squalane."],
            ["PureBotanics French Lavender Bath Salts 400g", 449.0, 130.0, 4.8, 77, "https://images.unsplash.com/photo-1608248597359-5974c86de1a4?w=600&auto=format&fit=crop&q=80", "Epsom and Dead Sea salts with dried lavender buds for muscle relaxation."]
        ],
        "Sports": [
            ["AeroGrip Pro Non-Slip TPE Yoga Mat 6mm", 1299.0, 480.0, 4.8, 160, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80", "Eco-friendly dual-layer textured non-slip mat with alignment guide lines and carry strap."],
            ["IronFlex Quick-Adjustable Dumbbells (Pair)", 4999.0, 2300.0, 4.7, 85, "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80", "Dial-system adjustable weights from 2.5kg to 12.5kg with heavy-duty cast iron plates."],
            ["PowerBand Pro 5-Level Resistance Tube Set", 899.0, 310.0, 4.6, 140, "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80", "Natural latex resistance bands up to 150 lbs with padded foam handles, door anchor, and ankle straps."],
            ["ThermoSteel Insulated Protein Shaker 750ml", 799.0, 260.0, 4.7, 110, "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80", "Double-wall vacuum insulated stainless steel shaker with stainless steel whisk ball."],
            ["SpeedJump Pro Weighted Skipping Rope", 499.0, 150.0, 4.5, 95, "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80", "360-degree ball bearing system with adjustable steel cable and memory foam handles."],
            ["PulseRelief Deep Tissue Massage Gun", 3499.0, 1450.0, 4.8, 125, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80", "Brushless motor delivering 3200 RPM with 6 interchangeable massage heads and 30 speed levels."],
            ["HydraTrail Lightweight Running Vest 5L", 1899.0, 720.0, 4.6, 48, "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80", "Breathable mesh running backpack with 2x 500ml soft flasks and reflective safety strips."],
            ["ApexTrek Carbon Fiber Trekking Poles", 2199.0, 850.0, 4.7, 62, "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80", "Ultra-lightweight collapsible hiking sticks with natural cork grip and quick lock mechanism."],
            ["ProKnee Compression Support Sleeves (Pair)", 699.0, 220.0, 4.5, 130, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80", "3D knitted elastic compression sleeve with silicone anti-slip strips for joint stability."],
            ["WildPeak 4-Person Waterproof Camping Tent", 5499.0, 2600.0, 4.6, 38, "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80", "Double-layer PU3000mm waterproof dome tent with mesh windows and easy hydraulic setup."],
            ["GripFit Padded Weightlifting Gym Gloves", 599.0, 180.0, 4.4, 88, "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80", "Silicone padded palm with breathable mesh and integrated wrist wraps for heavy lifts."],
            ["EverStrike Pro Punching Bag & Mitts Kit", 2999.0, 1200.0, 4.5, 52, "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop&q=80", "Durable synthetic leather heavy hanging bag with steel swivel chain and boxing gloves."],
            ["AeroSpike Badminton Racket Set with Shuttlecocks", 1799.0, 680.0, 4.6, 79, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80", "Full carbon fiber high-tension lightweight rackets with padded thermal bag."],
            ["CoreSlider Fitness Ab Roller Wheel", 799.0, 260.0, 4.5, 110, "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80", "Dual wide wheel stability with soft foam knee pad for core abdominal workouts."]
        ],
        "Grocery": [
            ["Tuscan Gold Extra Virgin Olive Oil 1L", 1199.0, 520.0, 4.9, 170, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80", "First cold-pressed single estate extra virgin olive oil with low acidity (<0.3%)."],
            ["Himalayan Wild Forest Raw Organic Honey 500g", 599.0, 210.0, 4.8, 195, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80", "Unpasteurized and unfiltered pure wild blossom honey packed with natural pollen and enzymes."],
            ["NutriCrunch California Jumbo Almonds 500g", 649.0, 280.0, 4.7, 180, "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80", "100% natural supreme whole almonds rich in vitamin E, protein, and healthy fats."],
            ["Kashmir Valley Grade-A Mongra Saffron 1g", 499.0, 180.0, 4.9, 85, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80", "GI tagged deep red saffron stigmas with intense aroma for cooking, desserts, and immunity."],
            ["PureOrigin Pink Himalayan Rock Salt 1kg", 199.0, 45.0, 4.8, 220, "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=600&auto=format&fit=crop&q=80", "100% natural unrefined mineral-rich edible rock salt with 84 essential trace minerals."],
            ["BlueMountain Single-Origin Whole Coffee Beans 500g", 899.0, 360.0, 4.7, 110, "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80", "Medium-dark roasted 100% Arabica beans with tasting notes of chocolate, caramel, and citrus."],
            ["Organic Royal White Quinoa Grains 1kg", 449.0, 150.0, 4.6, 95, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "Pre-washed gluten-free superfood high in complete plant protein and dietary fiber."],
            ["ZenCeremonial Grade Japanese Matcha Green Tea 50g", 999.0, 380.0, 4.8, 72, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80", "Shade-grown stone-ground vibrant green matcha rich in L-Theanine and antioxidants."],
            ["CocoPure Cold-Pressed Virgin Coconut Oil 500ml", 399.0, 130.0, 4.7, 140, "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80", "Centrifuge extracted raw coconut oil suitable for keto cooking, hair care, and skin hydration."],
            ["Artisan Noir 85% Dark Single-Origin Chocolate (Pack of 3)", 549.0, 195.0, 4.8, 130, "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80", "Handcrafted bean-to-bar gourmet dark chocolate with organic cocoa butter and minimal raw cane sugar."],
            ["NutriHarvest Organic Chia Seeds 500g", 349.0, 110.0, 4.7, 165, "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80", "Raw black chia seeds packed with omega-3 fatty acids, iron, and soluble dietary fiber."],
            ["GoldenShield Pure Turmeric Curcumin Powder 500g", 249.0, 70.0, 4.8, 105, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80", "High 5.5% curcumin content Lakadong turmeric powder with natural anti-inflammatory benefits."],
            ["RoyalCrown Organic Medjool Dates 500g", 699.0, 280.0, 4.9, 124, "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80", "Plump, caramel-sweet natural large Medjool dates loaded with potassium and fiber."],
            ["GoldenGrain Rolled Gluten-Free Oats 1kg", 329.0, 110.0, 4.7, 150, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "High fiber whole grain rolled oats perfect for overnight breakfast bowls."]
        ]
    };

    const INDIAN_CITIES = [
        ["Mumbai", "Maharashtra", "West"],
        ["Pune", "Maharashtra", "West"],
        ["Ahmedabad", "Gujarat", "West"],
        ["Surat", "Gujarat", "West"],
        ["New Delhi", "Delhi", "North"],
        ["Noida", "Uttar Pradesh", "North"],
        ["Gurugram", "Haryana", "North"],
        ["Chandigarh", "Punjab", "North"],
        ["Jaipur", "Rajasthan", "North"],
        ["Lucknow", "Uttar Pradesh", "North"],
        ["Bengaluru", "Karnataka", "South"],
        ["Hyderabad", "Telangana", "South"],
        ["Chennai", "Tamil Nadu", "South"],
        ["Kochi", "Kerala", "South"],
        ["Coimbatore", "Tamil Nadu", "South"],
        ["Visakhapatnam", "Andhra Pradesh", "South"],
        ["Kolkata", "West Bengal", "East"],
        ["Bhubaneswar", "Odisha", "East"],
        ["Patna", "Bihar", "East"],
        ["Guwahati", "Assam", "East"],
        ["Indore", "Madhya Pradesh", "Central"],
        ["Bhopal", "Madhya Pradesh", "Central"],
        ["Nagpur", "Maharashtra", "Central"],
        ["Raipur", "Chhattisgarh", "Central"]
    ];

    const CUSTOMER_NAMES = [
        "Aarav Sharma", "Diya Patel", "Vivaan Gupta", "Ananya Iyer", "Reyansh Reddy",
        "Ishaan Verma", "Aditi Deshmukh", "Kabir Nair", "Saanvi Rao", "Dhruv Sen",
        "Pooja Joshi", "Rohan Mehta", "Neha Kapoor", "Arjun Bhatt", "Kavya Menon",
        "Manish Agarwal", "Sneha Kulkarni", "Karan Malhotra", "Riya Mukherjee", "Nikhil Pillai",
        "Tanvi Choudhury", "Vikram Rathore", "Shreya Das", "Sameer Singhania", "Priyanka Roy",
        "Siddharth Hegde", "Meera Nambiar", "Aditya Saxena", "Tarun Bansal", "Ritu Sethi",
        "Harsh Vardhan", "Deepika Kaul", "Abhishek Tiwari", "Swati Nanda", "Gaurav Chawla",
        "Bhavna Shukla", "Kunal Goswami", "Anushka Ghosh", "Mohit Pandey", "Divya Sundaram",
        "Pranav Namboodiri", "Shikha Srivastava", "Varun Khurana", "Pallavi Hegde", "Rahul Trivedi",
        "Payal Banerjee", "Amitesh Kumar", "Jaspreet Kaur", "Simran Gill", "Devendra Chauhan",
        "Kritika Mathur", "Sanjay Vishwakarma", "Monika Rawat", "Chirag Parekh", "Shalini George"
    ];

    const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash on Delivery", "Demo Payment"];
    const RETURN_REASONS = [
        "Defective / Not Working",
        "Size / Fit Issue",
        "Quality Not as Expected",
        "Item Different from Description",
        "Delayed Delivery",
        "Changed Mind"
    ];

    function createPrng(seed = 42) {
        let s = seed % 2147483647;
        if (s <= 0) s += 2147483646;
        return function() {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    function generateSeedDatabase() {
        const random = createPrng(42);

        function randChoice(arr) {
            return arr[Math.floor(random() * arr.length)];
        }

        function randWeighted(items, weights) {
            const total = weights.reduce((a, b) => a + b, 0);
            let r = random() * total;
            for (let i = 0; i < items.length; i++) {
                if (r < weights[i]) return items[i];
                r -= weights[i];
            }
            return items[items.length - 1];
        }

        function randSample(arr, k) {
            const result = [];
            const taken = new Set();
            while (result.length < k && result.length < arr.length) {
                const idx = Math.floor(random() * arr.length);
                if (!taken.has(idx)) {
                    taken.add(idx);
                    result.push(arr[idx]);
                }
            }
            return result;
        }

        // 1. Users
        const users = [
            {
                id: 1,
                name: "Administrator",
                email: "admin@nybasket.com",
                password: "admin123",
                role: "admin",
                created_at: new Date(Date.now() - 365 * 86400000).toISOString()
            },
            {
                id: 2,
                name: "Demo Customer",
                email: "demo@nybasket.com",
                password: "customer123",
                role: "customer",
                created_at: new Date(Date.now() - 180 * 86400000).toISOString()
            }
        ];

        // 2. Products
        const products = [];
        const stockChoices = [0, 5, 8, 15, 25, 40, 60, 85, 120];
        let prodId = 1;

        for (const [category, items] of Object.entries(CATEGORIES_DATA)) {
            for (const [name, price, cost, rating, review_count, image_url, description] of items) {
                const stock = randChoice(stockChoices);
                const daysAgo = Math.floor(random() * 265) + 100;
                products.push({
                    id: prodId++,
                    name,
                    category,
                    description,
                    price: parseFloat(price.toFixed(2)),
                    cost: parseFloat(cost.toFixed(2)),
                    stock,
                    rating,
                    review_count,
                    image_url,
                    created_at: new Date(Date.now() - daysAgo * 86400000).toISOString()
                });
            }
        }

        // 3. Customers
        const customers = [];
        for (let i = 0; i < CUSTOMER_NAMES.length; i++) {
            const name = CUSTOMER_NAMES[i];
            const [city, state, region] = randChoice(INDIAN_CITIES);
            const emailNum = Math.floor(random() * 90) + 10;
            const email = `${name.toLowerCase().replace(/\s+/g, '.')}${emailNum}@gmail.com`;
            const p1 = Math.floor(random() * 30000) + 70000;
            const p2 = Math.floor(random() * 90000) + 10000;
            const phone = `+91 ${p1} ${p2}`;
            const daysAgo = Math.floor(random() * 305) + 60;

            customers.push({
                id: i + 1,
                name,
                email,
                phone,
                city,
                state,
                region,
                customer_type: "New Customer",
                created_at: new Date(Date.now() - daysAgo * 86400000).toISOString()
            });
        }

        // 4. Orders & Order Items
        const orders = [];
        const orderItems = [];
        const returns = [];

        const totalOrders = 280;
        const customerWeights = customers.map(() => randChoice([1, 1, 2, 3, 5, 10]));
        let orderItemId = 1;
        let returnId = 1;

        const startDateMs = Date.now() - 360 * 86400000;

        for (let oId = 1; oId <= totalOrders; oId++) {
            const customer = randWeighted(customers, customerWeights);
            const daysOffset = Math.floor(random() * 355);
            const hourOffset = Math.floor(random() * 14) + 8;
            const minOffset = Math.floor(random() * 60);
            const orderDate = new Date(startDateMs + daysOffset * 86400000 + hourOffset * 3600000 + minOffset * 60000);

            const paymentMethod = randWeighted(PAYMENT_METHODS, [40, 25, 15, 15, 5]);
            const status = randWeighted(["Completed", "Shipped", "Processing", "Cancelled", "Returned"], [74, 10, 6, 5, 5]);

            const numItems = randWeighted([1, 2, 3, 4], [40, 35, 18, 7]);
            const chosenProds = randSample(products, numItems);

            let orderTotalAmount = 0.0;
            let orderTotalCost = 0.0;
            let orderTotalProfit = 0.0;

            for (const prod of chosenProds) {
                const qty = randWeighted([1, 2, 3], [80, 15, 5]);
                const unitPrice = prod.price;
                const unitCost = prod.cost;
                const itemTotal = unitPrice * qty;
                const itemCost = unitCost * qty;
                const itemProfit = itemTotal - itemCost;

                const itemObj = {
                    id: orderItemId++,
                    order_id: oId,
                    product_id: prod.id,
                    quantity: qty,
                    unit_price: parseFloat(unitPrice.toFixed(2)),
                    unit_cost: parseFloat(unitCost.toFixed(2)),
                    total_price: parseFloat(itemTotal.toFixed(2)),
                    profit: parseFloat(itemProfit.toFixed(2))
                };
                orderItems.push(itemObj);

                orderTotalAmount += itemTotal;
                orderTotalCost += itemCost;
                orderTotalProfit += itemProfit;

                if (status === "Returned") {
                    const returnDays = Math.floor(random() * 5) + 2;
                    returns.push({
                        id: returnId++,
                        order_id: oId,
                        product_id: prod.id,
                        reason: randChoice(RETURN_REASONS),
                        return_date: new Date(orderDate.getTime() + returnDays * 86400000).toISOString(),
                        status: "Approved"
                    });
                }
            }

            orders.push({
                id: oId,
                customer_id: customer.id,
                order_date: orderDate.toISOString(),
                total_amount: parseFloat(orderTotalAmount.toFixed(2)),
                total_cost: parseFloat(orderTotalCost.toFixed(2)),
                total_profit: parseFloat(orderTotalProfit.toFixed(2)),
                payment_method: paymentMethod,
                status,
                shipping_city: customer.city,
                shipping_state: customer.state,
                region: customer.region
            });
        }

        // 5. Segment Customers
        const nowMs = Date.now();
        for (const cust of customers) {
            const custOrders = orders.filter(o => o.customer_id === cust.id && o.status !== "Cancelled");
            const numOrders = custOrders.length;
            const totalSpent = custOrders.reduce((sum, o) => sum + o.total_amount, 0);

            let lastOrderDate = custOrders.length > 0
                ? new Date(Math.max(...custOrders.map(o => new Date(o.order_date).getTime())))
                : new Date(cust.created_at);

            const daysInactive = Math.floor((nowMs - lastOrderDate.getTime()) / 86400000);

            let segment = "New Customer";
            if (totalSpent >= 25000 || numOrders >= 6) {
                segment = "VIP Customer";
            } else if (daysInactive > 90 && numOrders > 0) {
                segment = "At Risk";
            } else if (numOrders >= 2) {
                segment = "Regular Customer";
            }

            cust.customer_type = segment;
        }

        return {
            users,
            products,
            customers,
            orders,
            order_items: orderItems,
            returns
        };
    }

    const NyDataset = {
        CATEGORIES_DATA,
        INDIAN_CITIES,
        CUSTOMER_NAMES,
        PAYMENT_METHODS,
        RETURN_REASONS,
        generateSeedDatabase
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NyDataset;
    } else {
        root.NyDataset = NyDataset;
    }
})(typeof window !== 'undefined' ? window : globalThis);
