export const trails = [
  {
    id: 'three-sisters-loop',
    name: 'Three Sisters Loop',
    location: 'Three Sisters Wilderness, Oregon',
    miles: 50,
    days: 5,
    permit: 'Central Cascades Wilderness Permit — $6/group via Recreation.gov',
    gearCategories: [
      {
        id: 'shelter',
        icon: '⛺',
        title: 'Shelter & Sleep',
        items: [
          { id: 's1', name: '3-Season Tent (freestanding)', note: 'Must handle wind, rain, hail. Footprint recommended on pumice/obsidian terrain.', priority: 'critical', checked: false },
          { id: 's2', name: 'Extra Tent Stakes (4–6) + Guylines', note: 'Wind can be severe near the Sisters. Pumice soil does not hold stakes well.', priority: 'recommended', checked: false },
          { id: 's3', name: 'Tent Footprint / Ground Cloth', note: 'Obsidian fragments are razor-sharp. Protects your tent floor significantly.', priority: 'recommended', checked: false },
          { id: 's4', name: 'Sleeping Bag — rated 20°F or lower', note: 'Temps at 7,000 ft can hit mid-20s even in August. Do not go 32°F rated.', priority: 'critical', checked: false },
          { id: 's5', name: 'Sleeping Pad — insulated (R-value 3+)', note: 'Ground insulation is as important as your bag. Inflatable pads pack small.', priority: 'critical', checked: false },
          { id: 's6', name: 'Sleeping Bag Liner', note: 'Adds 5–10°F warmth, keeps bag cleaner. Optional but genuinely useful.', priority: 'optional', checked: false },
        ]
      },
      {
        id: 'pack',
        icon: '🎒',
        title: 'Pack & Carry',
        items: [
          { id: 'p1', name: 'Backpack — 50–65L', note: '5 days of food adds up. Torso-length-fitted packs prevent pain on high-mileage days.', priority: 'critical', checked: false },
          { id: 'p2', name: 'Pack Rain Cover', note: 'Afternoon thunderstorms are common. Many modern packs are not adequately waterproof.', priority: 'recommended', checked: false },
          { id: 'p3', name: 'Waterproof Pack Liner (dry bag)', note: 'Keep sleep system, electronics, food inside a dry bag liner inside the pack.', priority: 'recommended', checked: false },
          { id: 'p4', name: 'Trekking Poles', note: 'Sandy pumice descents are hard on knees. Poles help with stream crossings on Day 2.', priority: 'recommended', checked: false },
          { id: 'p5', name: 'Trail Runners or Hiking Boots (broken in)', note: 'Never debut new footwear on a 50-mile trip. Obsidian terrain is tough on shoes.', priority: 'critical', checked: false },
          { id: 'p6', name: 'Gaiters — low or trail (Dirty Girl)', note: 'Practically mandatory. Pumice and sandy volcanic grit will fill your shoes constantly.', priority: 'critical', checked: false },
          { id: 'p7', name: 'Camp Sandals / Crocs', note: 'Feet will want out of boots after 10+ miles. Double as stream crossing shoes.', priority: 'optional', checked: false },
          { id: 'p8', name: 'Hiking Socks — merino wool (3 pairs)', note: 'Darn Tough or Smartwool. One on, one drying, one clean.', priority: 'critical', checked: false },
        ]
      },
      {
        id: 'clothing',
        icon: '👕',
        title: 'Clothing',
        items: [
          { id: 'c1', name: 'Merino Wool T-Shirt / Base Layer (2×)', note: 'Wear one, pack one. Merino handles 5 days without smelling catastrophic.', priority: 'critical', checked: false },
          { id: 'c2', name: 'Sun Hoody (UPF 50+)', note: 'Miles of exposed lava with zero shade. Lighter than sunscreen every 90 min.', priority: 'critical', checked: false },
          { id: 'c3', name: 'Merino Underwear (2–3×)', note: 'Chafing on a 12-mile day is a real problem. Address it proactively.', priority: 'critical', checked: false },
          { id: 'c4', name: 'Hiking Pants / Convertible', note: 'Long pants help in mosquito zones near the Obsidian area.', priority: 'recommended', checked: false },
          { id: 'c5', name: 'Thermal Leggings', note: 'For sleeping and cold mornings at elevation.', priority: 'recommended', checked: false },
          { id: 'c6', name: 'Puffy Jacket — 600+ fill down or synthetic', note: 'Mandatory for mornings, evenings, camp. Temps swing 40°F+ from midday to night.', priority: 'critical', checked: false },
          { id: 'c7', name: 'Hardshell Rain Jacket (Gore-Tex or equiv.)', note: 'Afternoon thunderstorms hit fast. Doubles as windshell in exposed lava fields.', priority: 'critical', checked: false },
          { id: 'c8', name: 'Rain Pants (packable)', note: 'Wet legs on a cold exposed ridge are miserable. Worth it if rain is forecast.', priority: 'optional', checked: false },
          { id: 'c9', name: 'Wide-Brim Sun Hat', note: 'Miles of exposed volcanic terrain. Wide brim beats a cap for all-day sun protection.', priority: 'critical', checked: false },
          { id: 'c10', name: 'Warm Beanie', note: 'Mornings, evenings, sleeping. Merino or fleece. Small, light, big comfort.', priority: 'recommended', checked: false },
          { id: 'c11', name: 'Neck Gaiter / Buff', note: 'Multipurpose: dust in burn zone, sun on ridges, warmth at camp.', priority: 'recommended', checked: false },
          { id: 'c12', name: 'Lightweight Gloves', note: 'Cold mornings starting early. Takes up almost no space.', priority: 'optional', checked: false },
        ]
      },
      {
        id: 'navigation',
        icon: '🗺️',
        title: 'Navigation & Safety',
        items: [
          { id: 'n1', name: 'Paper Topo Map — Nat Geo #821', note: 'GPS fails, batteries die, maps do not. Non-negotiable.', priority: 'critical', checked: false },
          { id: 'n2', name: 'GPS / Phone with Gaia GPS Offline', note: 'Download offline maps before leaving. Zero cell service for the entire loop.', priority: 'critical', checked: false },
          { id: 'n3', name: 'Compass', note: 'For use with paper map on lava field crossings.', priority: 'recommended', checked: false },
          { id: 'n4', name: 'First Aid Kit', note: 'Include moleskin, Leukotape, ibuprofen, antihistamines, wound care, ace bandage, tweezers.', priority: 'critical', checked: false },
          { id: 'n5', name: 'Satellite Communicator (Garmin inReach)', note: 'Zero cell service all 5 days. Your only way out if something goes wrong. Rent from REI ~$75.', priority: 'critical', checked: false },
          { id: 'n6', name: 'Headlamp + Extra Batteries', note: 'Black Diamond Spot or Petzl Actik. Extra batteries for 5 nights.', priority: 'critical', checked: false },
          { id: 'n7', name: 'Emergency Bivy / Space Blanket', note: 'Weighs nothing. A storm at 6,500 ft without shelter can be life-threatening.', priority: 'recommended', checked: false },
          { id: 'n8', name: 'Whistle', note: 'Emergency signaling. Attach to pack shoulder strap.', priority: 'recommended', checked: false },
          { id: 'n9', name: 'Knife / Multi-tool', note: 'General utility. Leatherman Squirt or similar is enough.', priority: 'recommended', checked: false },
          { id: 'n10', name: 'Portable Battery Bank (10,000–20,000 mAh)', note: '5 days no charging. Powers phone, headlamp, satellite communicator backup.', priority: 'critical', checked: false },
        ]
      },
      {
        id: 'kitchen',
        icon: '🍳',
        title: 'Kitchen & Water',
        items: [
          { id: 'k1', name: 'Backpacking Stove (Jetboil Flash or MSR PocketRocket 2)', note: 'No campfires allowed above 5,700 ft. A stove is not optional.', priority: 'critical', checked: false },
          { id: 'k2', name: 'Fuel Canisters (2× 100g or 1× 230g)', note: '5 days of cooking. Running out with no fires allowed is a bad situation.', priority: 'critical', checked: false },
          { id: 'k3', name: 'Cook Pot — 1L titanium or aluminum', note: 'If not using a Jetboil system. Snow Peak or MSR trail-proven.', priority: 'recommended', checked: false },
          { id: 'k4', name: 'Titanium Spork / Long-handled Spoon', note: 'Long handle for freeze-dried pouches.', priority: 'critical', checked: false },
          { id: 'k5', name: 'Insulated Mug / Cup', note: 'Morning coffee and hot drinks at camp. Small luxury, big morale boost.', priority: 'optional', checked: false },
          { id: 'k6', name: 'Water Filter — Sawyer Squeeze or BeFree', note: 'Sawyer Squeeze is the trail classic. Filter at South Matthieu before lava crossing.', priority: 'critical', checked: false },
          { id: 'k7', name: 'Backup Chemical Purification (Aquatabs)', note: 'If the filter breaks or freezes. Weighs almost nothing.', priority: 'recommended', checked: false },
          { id: 'k8', name: 'Water Bottles / Soft Flasks (3–4L total)', note: 'Carry at least 3L approaching lava crossings. 2L soft flask + 1L Nalgene covers most situations.', priority: 'critical', checked: false },
        ]
      },
      {
        id: 'hygiene',
        icon: '🧴',
        title: 'Hygiene & Leave No Trace',
        items: [
          { id: 'h1', name: 'Trowel (cat hole digging)', note: 'Bury waste 6–8 inches deep, 200+ feet from water/trail. Pumice soil is easy to dig.', priority: 'critical', checked: false },
          { id: 'h2', name: 'Toilet Paper + Pack-out Bags', note: 'Pack out used TP. Does not biodegrade fast in dry volcanic soil.', priority: 'critical', checked: false },
          { id: 'h3', name: 'Biodegradable Soap — Dr. Bronner\'s (2oz)', note: 'For hands, body, dishes. Always 200+ feet from water sources.', priority: 'critical', checked: false },
          { id: 'h4', name: 'Hand Sanitizer (60ml+)', note: 'Before every meal and after restroom use.', priority: 'critical', checked: false },
          { id: 'h5', name: 'Sunscreen SPF 50+ (2oz+)', note: 'Miles of exposed lava fields. Volcanic reflectivity intensifies UV. Reapply every 90 min.', priority: 'critical', checked: false },
          { id: 'h6', name: 'Insect Repellent — DEET or Picaridin', note: 'Mosquitoes near Obsidian Zone and Matthieu Lakes can be intense July–early August.', priority: 'critical', checked: false },
          { id: 'h7', name: 'Mosquito Head Net', note: 'Nearly weightless. Makes the difference on brutal mosquito evenings.', priority: 'recommended', checked: false },
          { id: 'h8', name: 'Lip Balm with SPF (2×)', note: 'Altitude + dry volcanic air = cracked lips fast.', priority: 'recommended', checked: false },
          { id: 'h9', name: 'Baby Wipes (unscented, pack out)', note: 'Backcountry bath. Pack them out. A wipedown before sleep is a game changer.', priority: 'recommended', checked: false },
          { id: 'h10', name: 'Anti-Chafe Balm (Body Glide)', note: 'Thighs, feet, shoulders. Apply proactively, not reactively.', priority: 'critical', checked: false },
          { id: 'h11', name: 'Toothbrush + Toothpaste (travel size)', note: 'Spit 200+ feet from water. Biodegradable toothpaste preferred.', priority: 'critical', checked: false },
          { id: 'h12', name: 'Blister Kit (Leukotape, moleskin, needle)', note: 'Address any hotspot before it becomes a blister. Pumice gets everywhere.', priority: 'critical', checked: false },
          { id: 'h13', name: 'Ursack / Food Storage + Odor-proof Bags', note: 'Bears present. Ursack Major is lighter than hard canister and USFS-accepted.', priority: 'recommended', checked: false },
          { id: 'h14', name: 'Trash Bags (2–3 ziplock freezer bags)', note: 'Pack out everything. The Three Sisters has suffered major overuse damage.', priority: 'critical', checked: false },
        ]
      }
    ]
  }
]

export default trails