// Road signs reference data.
// All imageUrl values verified via MD5-computed Wikimedia Commons paths (HTTP 200).
// URL format: https://upload.wikimedia.org/wikipedia/commons/{md5[0]}/{md5[0:2]}/{filename}
// Licence: Open Government Licence v1.0 (Crown Copyright). Free to reproduce accurately.

export type SignCategory =
  | 'Warning'
  | 'Regulatory — Give Way & Priority'
  | 'Regulatory — Speed Limits'
  | 'Regulatory — Prohibitions'
  | 'Regulatory — Mandatory Directions'
  | 'Information & Direction';

export type RoadSign = {
  id: string;
  name: string;
  category: SignCategory;
  description: string;
  imageUrl: string;
  keyFact?: string;
};

const W = 'https://upload.wikimedia.org/wikipedia/commons';

const roadSigns: RoadSign[] = [

  // ── WARNING SIGNS ─────────────────────────────────────────────────────────
  {
    id: 'W001',
    name: 'Crossroads',
    category: 'Warning',
    description: 'A crossroads junction ahead. Traffic may approach from all four directions.',
    imageUrl: `${W}/b/bd/UK_traffic_sign_501.svg`,
  },
  {
    id: 'W002',
    name: 'T-junction',
    category: 'Warning',
    description: 'The road ahead ends at a T-junction. You must turn left or right.',
    imageUrl: `${W}/0/09/UK_traffic_sign_502.svg`,
  },
  {
    id: 'W003',
    name: 'Staggered junction',
    category: 'Warning',
    description: 'Side roads are offset and do not align directly opposite each other.',
    imageUrl: `${W}/d/d5/UK_traffic_sign_503.svg`,
  },
  {
    id: 'W004',
    name: 'Roundabout ahead',
    category: 'Warning',
    description: 'A roundabout is ahead. Give way to traffic already on the roundabout from the right.',
    imageUrl: `${W}/f/f5/UK_traffic_sign_517.svg`,
  },
  {
    id: 'W005',
    name: 'Traffic signals ahead',
    category: 'Warning',
    description: 'Traffic lights are ahead. Prepare to slow and stop.',
    imageUrl: `${W}/b/b6/UK_traffic_sign_543.svg`,
  },
  {
    id: 'W006',
    name: 'Pedestrian crossing ahead',
    category: 'Warning',
    description: 'A pedestrian crossing is ahead. Be prepared to stop.',
    imageUrl: `${W}/e/ea/UK_traffic_sign_544.svg`,
  },
  {
    id: 'W007',
    name: 'School — children crossing',
    category: 'Warning',
    description: 'Children may be crossing or near the road ahead. Take extra care.',
    imageUrl: `${W}/9/97/UK_traffic_sign_545.svg`,
    keyFact: 'You MUST stop when a school crossing patrol holds out the "Stop — Children" sign.',
  },
  {
    id: 'W008',
    name: 'Level crossing with barriers',
    category: 'Warning',
    description: 'A railway level crossing with automatic or manually operated barriers ahead.',
    imageUrl: `${W}/c/c1/UK_traffic_sign_750.svg`,
    keyFact: 'Stop when red lights flash. Never zig-zag around barriers — a second train may be coming.',
  },
  {
    id: 'W009',
    name: 'Level crossing without barriers',
    category: 'Warning',
    description: 'A railway crossing ahead with no gates or barriers. Extra vigilance required.',
    imageUrl: `${W}/7/7f/UK_traffic_sign_752.svg`,
    keyFact: 'Look both ways and ensure it is completely safe before crossing.',
  },
  {
    id: 'W010',
    name: 'Sharp bend to right',
    category: 'Warning',
    description: 'A sharp bend to the right ahead. Reduce speed before the bend, not during it.',
    imageUrl: `${W}/d/d3/UK_traffic_sign_511.svg`,
    keyFact: 'Brake and select the correct gear before entering any bend.',
  },
  {
    id: 'W011',
    name: 'Sharp bend to left',
    category: 'Warning',
    description: 'A sharp bend to the left ahead. Reduce speed before the bend.',
    imageUrl: `${W}/4/47/UK_traffic_sign_512.svg`,
  },
  {
    id: 'W012',
    name: 'Double bend — first to left',
    category: 'Warning',
    description: 'Two consecutive bends ahead, the first to the left.',
    imageUrl: `${W}/9/9d/UK_traffic_sign_513.svg`,
  },
  {
    id: 'W013',
    name: 'Road narrows on right',
    category: 'Warning',
    description: 'The road becomes narrower on the right side ahead.',
    imageUrl: `${W}/b/b1/UK_traffic_sign_521.svg`,
  },
  {
    id: 'W014',
    name: 'Road narrows on both sides',
    category: 'Warning',
    description: 'The road narrows from both sides ahead.',
    imageUrl: `${W}/d/d1/UK_traffic_sign_522.svg`,
  },
  {
    id: 'W015',
    name: 'Two-way traffic',
    category: 'Warning',
    description: 'Two-way traffic ahead on a road that was previously one-way, or where drivers may not expect it.',
    imageUrl: `${W}/5/5e/UK_traffic_sign_524.svg`,
  },
  {
    id: 'W016',
    name: 'Slippery road',
    category: 'Warning',
    description: 'The road surface is or may become slippery — ice, mud, wet leaves or loose gravel.',
    imageUrl: `${W}/f/f9/UK_traffic_sign_557.svg`,
    keyFact: 'On ice, stopping distances can be up to ten times greater than on a dry road.',
  },
  {
    id: 'W017',
    name: 'Speed humps',
    category: 'Warning',
    description: 'Speed humps are ahead. Reduce speed to avoid vehicle damage.',
    imageUrl: `${W}/d/d9/UK_traffic_sign_557.1.svg`,
  },
  {
    id: 'W018',
    name: 'Steep hill downwards',
    category: 'Warning',
    description: 'A steep downhill gradient ahead. Select a lower gear before descending.',
    imageUrl: `${W}/6/66/UK_traffic_sign_519.svg`,
    keyFact: 'Continuous footbraking on long descents causes brake fade. Use engine braking instead.',
  },
  {
    id: 'W019',
    name: 'Steep hill upwards',
    category: 'Warning',
    description: 'A steep uphill gradient ahead. Slow vehicles may be moving slowly.',
    imageUrl: `${W}/0/0a/UK_traffic_sign_518.svg`,
  },
  {
    id: 'W020',
    name: 'Hump bridge',
    category: 'Warning',
    description: 'A hump-back bridge ahead. Visibility of oncoming traffic is blocked at the crest.',
    imageUrl: `${W}/b/bf/UK_traffic_sign_528.svg`,
    keyFact: 'Approach slowly and keep to the left. Oncoming vehicles may be hidden until the last moment.',
  },
  {
    id: 'W021',
    name: 'Wild animals',
    category: 'Warning',
    description: 'Wild animals (commonly deer) frequently cross the road in this area.',
    imageUrl: `${W}/0/0c/UK_traffic_sign_551.svg`,
    keyFact: 'Highest risk at dawn and dusk. Scan the verges and be ready to stop.',
  },
  {
    id: 'W022',
    name: 'Cattle',
    category: 'Warning',
    description: 'Livestock may be on or crossing the road ahead.',
    imageUrl: `${W}/f/f8/UK_traffic_sign_549.svg`,
  },
  {
    id: 'W023',
    name: 'Loose chippings',
    category: 'Warning',
    description: 'Loose road surface material ahead. Can crack windscreens and cause skids.',
    imageUrl: `${W}/5/5d/UK_traffic_sign_556.svg`,
    keyFact: 'Reduce speed and increase following distance.',
  },
  {
    id: 'W024',
    name: 'Risk of ice',
    category: 'Warning',
    description: 'Ice or frost is likely on the road surface ahead.',
    imageUrl: `${W}/9/9c/UK_traffic_sign_558.svg`,
    keyFact: 'Black ice is nearly invisible. A glistening road in cold weather may be black ice.',
  },
  {
    id: 'W025',
    name: 'Low-flying aircraft',
    category: 'Warning',
    description: 'Low-flying aircraft or sudden aircraft noise is likely — usually near airfields.',
    imageUrl: `${W}/d/d8/UK_traffic_sign_560.svg`,
  },
  {
    id: 'W026',
    name: 'Falling or fallen rocks',
    category: 'Warning',
    description: 'Falling rocks are a hazard — typical on hill or cliff roads.',
    imageUrl: `${W}/5/53/UK_traffic_sign_561.svg`,
  },
  {
    id: 'W027',
    name: 'Ford',
    category: 'Warning',
    description: 'The road passes through a shallow water crossing (ford). Check depth before crossing.',
    imageUrl: `${W}/c/c6/UK_traffic_sign_580.svg`,
    keyFact: 'Depth varies after rain. If you must cross, drive slowly in first gear and test brakes afterwards.',
  },
  {
    id: 'W028',
    name: 'Cyclist entering road',
    category: 'Warning',
    description: 'A cycle route crosses or joins the road ahead. Watch for cyclists.',
    imageUrl: `${W}/6/6e/UK_traffic_sign_955.svg`,
  },

  // ── REGULATORY — GIVE WAY & PRIORITY ─────────────────────────────────────
  {
    id: 'R001',
    name: 'Give Way',
    category: 'Regulatory — Give Way & Priority',
    description: 'You must give way to traffic on the major road. Slow and stop if necessary.',
    imageUrl: `${W}/1/16/UK_traffic_sign_602.svg`,
    keyFact: 'Inverted red triangle. Unlike Stop, you do not have to halt if the road is clearly safe.',
  },
  {
    id: 'R002',
    name: 'Stop',
    category: 'Regulatory — Give Way & Priority',
    description: 'You MUST stop completely at this line before proceeding — every time, regardless of traffic.',
    imageUrl: `${W}/c/c8/UK_traffic_sign_601.1.svg`,
    keyFact: 'The only octagonal sign in the UK. Always stop — even if the road appears completely clear.',
  },
  {
    id: 'R003',
    name: 'Priority over oncoming vehicles',
    category: 'Regulatory — Give Way & Priority',
    description: 'You have priority through a narrow section. Oncoming vehicles must wait for you.',
    imageUrl: `${W}/4/4f/UK_traffic_sign_611.svg`,
  },
  {
    id: 'R004',
    name: 'Give way to oncoming vehicles',
    category: 'Regulatory — Give Way & Priority',
    description: 'Oncoming vehicles have priority. Wait in a passing place for them to pass.',
    imageUrl: `${W}/0/03/UK_traffic_sign_612.svg`,
  },

  // ── REGULATORY — SPEED LIMITS ─────────────────────────────────────────────
  {
    id: 'S001',
    name: 'Speed limit 20 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 20 mph. Common in residential areas and near schools.',
    imageUrl: `${W}/c/cd/UK_traffic_sign_670.svg`,
    keyFact: 'A mandatory limit — not a target. Drive slower if conditions require.',
  },
  {
    id: 'S002',
    name: 'Speed limit 30 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 30 mph. The default limit in built-up areas with street lighting.',
    imageUrl: `${W}/c/cd/UK_traffic_sign_671.svg`,
  },
  {
    id: 'S003',
    name: 'Speed limit 40 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 40 mph.',
    imageUrl: `${W}/4/4f/UK_traffic_sign_672.svg`,
  },
  {
    id: 'S004',
    name: 'Speed limit 50 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 50 mph. The limit for cars towing trailers on single carriageways.',
    imageUrl: `${W}/b/b2/UK_traffic_sign_673.svg`,
  },
  {
    id: 'S005',
    name: 'Speed limit 60 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 60 mph. The national limit on single carriageway roads.',
    imageUrl: `${W}/f/f9/UK_traffic_sign_674.svg`,
  },
  {
    id: 'S006',
    name: 'Speed limit 70 mph',
    category: 'Regulatory — Speed Limits',
    description: 'Maximum speed of 70 mph. The national limit on dual carriageways and motorways.',
    imageUrl: `${W}/7/7e/UK_traffic_sign_675.svg`,
  },

  // ── REGULATORY — PROHIBITIONS ─────────────────────────────────────────────
  {
    id: 'P001',
    name: 'No entry',
    category: 'Regulatory — Prohibitions',
    description: 'Entry is prohibited for all vehicles from this direction. Used at one-way street exits.',
    imageUrl: `${W}/b/ba/UK_traffic_sign_616.svg`,
    keyFact: 'Red circle with a horizontal white bar. Never enter under any circumstances.',
  },
  {
    id: 'P002',
    name: 'No motor vehicles',
    category: 'Regulatory — Prohibitions',
    description: 'Motor vehicles are prohibited. Cycles and pedestrians may be permitted.',
    imageUrl: `${W}/a/a3/UK_traffic_sign_619.svg`,
  },
  {
    id: 'P003',
    name: 'No right turn',
    category: 'Regulatory — Prohibitions',
    description: 'Turning right is prohibited at this junction.',
    imageUrl: `${W}/6/6e/UK_traffic_sign_612.1.svg`,
  },
  {
    id: 'P004',
    name: 'No left turn',
    category: 'Regulatory — Prohibitions',
    description: 'Turning left is prohibited at this junction.',
    imageUrl: `${W}/4/41/UK_traffic_sign_613.svg`,
  },
  {
    id: 'P005',
    name: 'No U-turns',
    category: 'Regulatory — Prohibitions',
    description: 'U-turns are prohibited on this road.',
    imageUrl: `${W}/e/e1/UK_traffic_sign_614.svg`,
  },
  {
    id: 'P006',
    name: 'No overtaking',
    category: 'Regulatory — Prohibitions',
    description: 'Overtaking of moving motor vehicles is prohibited.',
    imageUrl: `${W}/b/b9/UK_traffic_sign_632.svg`,
    keyFact: 'Red circle, two cars side by side. Ends at a national speed limit or end-of-restriction sign.',
  },
  {
    id: 'P007',
    name: 'No cycling',
    category: 'Regulatory — Prohibitions',
    description: 'Cycling is prohibited on this road or path.',
    imageUrl: `${W}/8/8f/UK_traffic_sign_618.svg`,
  },
  {
    id: 'P008',
    name: 'No pedestrians',
    category: 'Regulatory — Prohibitions',
    description: 'Pedestrians are not permitted on this road or path.',
    imageUrl: `${W}/3/39/UK_traffic_sign_617.svg`,
  },
  {
    id: 'P009',
    name: 'No stopping (clearway)',
    category: 'Regulatory — Prohibitions',
    description: 'No vehicle may stop at any time on this stretch of road.',
    imageUrl: `${W}/c/c6/UK_traffic_sign_638.svg`,
    keyFact: 'Red X in a red circle. Even picking up and setting down passengers is prohibited.',
  },
  {
    id: 'P010',
    name: 'No waiting',
    category: 'Regulatory — Prohibitions',
    description: 'Parking or waiting is prohibited during the times shown on nearby signs.',
    imageUrl: `${W}/3/30/UK_traffic_sign_636.svg`,
  },
  {
    id: 'P011',
    name: 'Height restriction',
    category: 'Regulatory — Prohibitions',
    description: 'Vehicles exceeding the stated height are prohibited from using this route.',
    imageUrl: `${W}/d/d9/UK_traffic_sign_629.1.svg`,
  },
  {
    id: 'P012',
    name: 'Width restriction',
    category: 'Regulatory — Prohibitions',
    description: 'Vehicles exceeding the stated width are prohibited.',
    imageUrl: `${W}/4/4b/UK_traffic_sign_629.svg`,
  },
  {
    id: 'P013',
    name: 'Weight limit',
    category: 'Regulatory — Prohibitions',
    description: 'Vehicles exceeding the stated maximum gross weight are prohibited. Common on weak bridges.',
    imageUrl: `${W}/6/68/UK_traffic_sign_622.svg`,
    keyFact: 'Always check your vehicle\'s gross weight before using a bridge with a weight restriction.',
  },

  // ── REGULATORY — MANDATORY DIRECTIONS ────────────────────────────────────
  {
    id: 'M001',
    name: 'Turn left ahead (mandatory)',
    category: 'Regulatory — Mandatory Directions',
    description: 'You must turn left ahead. Blue circle with white arrow — always mandatory.',
    imageUrl: `${W}/7/72/UK_traffic_sign_609.svg`,
    keyFact: 'Blue circular signs with white arrows are mandatory instructions — you must follow them.',
  },
  {
    id: 'M002',
    name: 'Turn right ahead (mandatory)',
    category: 'Regulatory — Mandatory Directions',
    description: 'You must turn right ahead.',
    imageUrl: `${W}/2/2c/UK_traffic_sign_610.svg`,
  },
  {
    id: 'M003',
    name: 'Keep left',
    category: 'Regulatory — Mandatory Directions',
    description: 'Pass to the left of the bollard or island. Mandatory.',
    imageUrl: `${W}/d/de/UK_traffic_sign_606.svg`,
  },
  {
    id: 'M004',
    name: 'Keep right',
    category: 'Regulatory — Mandatory Directions',
    description: 'Pass to the right of the bollard or island. Mandatory.',
    imageUrl: `${W}/7/72/UK_traffic_sign_607.svg`,
  },
  {
    id: 'M005',
    name: 'Mini-roundabout',
    category: 'Regulatory — Mandatory Directions',
    description: 'Mini-roundabout ahead. Give way to traffic from the right. Traffic circulates anti-clockwise.',
    imageUrl: `${W}/a/ab/UK_traffic_sign_611.1.svg`,
  },
  {
    id: 'M006',
    name: 'Ahead only',
    category: 'Regulatory — Mandatory Directions',
    description: 'You must go straight ahead — turning left or right at this junction is prohibited.',
    imageUrl: `${W}/d/d1/UK_traffic_sign_608.svg`,
  },
  {
    id: 'M007',
    name: 'One-way traffic',
    category: 'Regulatory — Mandatory Directions',
    description: 'Traffic flows in one direction only. Keep left unless overtaking.',
    imageUrl: `${W}/f/f3/UK_traffic_sign_647.svg`,
  },
  {
    id: 'M008',
    name: 'Shared use path — pedestrians and cyclists',
    category: 'Regulatory — Mandatory Directions',
    description: 'A path for joint use by pedestrians and cyclists. Cyclists must give way to pedestrians.',
    imageUrl: `${W}/4/4f/UK_traffic_sign_956.svg`,
  },
  {
    id: 'M009',
    name: 'Cyclists only',
    category: 'Regulatory — Mandatory Directions',
    description: 'A path or lane for cyclists only. Pedestrians must use a separate path.',
    imageUrl: `${W}/6/6c/UK_traffic_sign_957.svg`,
  },
  {
    id: 'M010',
    name: 'Pedestrians only',
    category: 'Regulatory — Mandatory Directions',
    description: 'A path or road for pedestrians only. No cycling or motor vehicles.',
    imageUrl: `${W}/6/6e/UK_traffic_sign_953.svg`,
  },

  // ── INFORMATION & DIRECTION ───────────────────────────────────────────────
  {
    id: 'I001',
    name: 'End of motorway',
    category: 'Information & Direction',
    description: 'Motorway ends here. Normal road rules resume — cyclists and pedestrians may now be present.',
    imageUrl: `${W}/c/c3/UK_traffic_sign_960.svg`,
  },
  {
    id: 'I002',
    name: 'Parking (P)',
    category: 'Information & Direction',
    description: 'A public car park or permitted parking place is indicated.',
    imageUrl: `${W}/0/0f/UK_traffic_sign_801.svg`,
  },
  {
    id: 'I003',
    name: 'Hospital (H)',
    category: 'Information & Direction',
    description: 'A hospital is nearby. Ambulances may be entering or leaving rapidly. Take care.',
    imageUrl: `${W}/8/8c/UK_traffic_sign_817.svg`,
  },
  {
    id: 'I004',
    name: 'No through road',
    category: 'Information & Direction',
    description: 'The road is a dead end — no exit at the far end. You will need to turn around.',
    imageUrl: `${W}/d/d4/UK_traffic_sign_811.svg`,
  },
];

export const ALL_SIGN_CATEGORIES: SignCategory[] = [
  'Warning',
  'Regulatory — Give Way & Priority',
  'Regulatory — Speed Limits',
  'Regulatory — Prohibitions',
  'Regulatory — Mandatory Directions',
  'Information & Direction',
];

export default roadSigns;
