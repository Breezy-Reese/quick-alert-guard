import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/road';

/* ============================================================
   SCHEMAS
============================================================ */
const ResponderSubSchema = new mongoose.Schema({
  responderId: mongoose.Schema.Types.ObjectId,
  name: String, type: String, hospital: String,
  eta: Number, distance: Number, status: String,
  location: { lat: Number, lng: Number }, dispatchedAt: Date,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: { type: String, select: false }, role: String, phone: String,
  isActive: { type: Boolean, default: true }, isVerified: { type: Boolean, default: true },
  licenseNumber: String, vehicleNumber: String, hospitalName: String,
  registrationNumber: String, address: String, location: { lat: Number, lng: Number },
  contactNumber: String, responderType: String,
  hospitalId: mongoose.Schema.Types.ObjectId,
  currentLocation: { lat: Number, lng: Number },
  certifications: [String], experience: Number,
  emergencyContacts: [{
    name: String, relationship: String, phone: String,
    email: String, isPrimary: Boolean, isNotified: { type: Boolean, default: false }
  }],
  medicalInfo: { bloodGroup: String, allergies: [String], medicalConditions: [String], medications: [String] },
}, { timestamps: true });

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, unique: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverName: String, driverPhone: String, type: String, severity: String, status: String,
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] },
  locationAddress: String, timestamp: Date, detectedAt: Date, confirmedAt: Date, resolvedAt: Date,
  speed: Number, impactForce: Number, airbagDeployed: Boolean, occupants: Number,
  injuries: Number, fatalities: Number, vehicleNumber: String, vehicleMake: String,
  vehicleModel: String, vehicleColor: String, responders: [ResponderSubSchema],
  emergencyContacts: [{ name: String, relationship: String, phone: String, isNotified: Boolean }],
  hospitalId: mongoose.Schema.Types.ObjectId, assignedAmbulance: String, assignedHospital: String,
}, { timestamps: true });

IncidentSchema.index({ location: '2dsphere' });

// ── AuditLog Schema ──────────────────────────────────────────
const AuditLogSchema = new mongoose.Schema({
  actorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  action:    { type: String, required: true },
  target:    { type: String },
  targetId:  { type: mongoose.Schema.Types.ObjectId },
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Incident = mongoose.model('Incident', IncidentSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

/* ============================================================
   HELPERS
============================================================ */
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const nairobiLocations = [
  { lat: -1.2921, lng: 36.8219, address: 'CBD, Nairobi' },
  { lat: -1.3031, lng: 36.7073, address: 'Westlands, Nairobi' },
  { lat: -1.2833, lng: 36.8167, address: 'Upper Hill, Nairobi' },
  { lat: -1.3192, lng: 36.8800, address: 'South B, Nairobi' },
  { lat: -1.2636, lng: 36.8030, address: 'Parklands, Nairobi' },
  { lat: -1.2408, lng: 36.8800, address: 'Kasarani, Nairobi' },
  { lat: -1.3170, lng: 36.7870, address: 'Ngong Road, Nairobi' },
  { lat: -1.2990, lng: 36.8360, address: 'Kilimani, Nairobi' },
];

/* ============================================================
   SEED
============================================================ */
async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Incident.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('✅ Cleared existing data\n');

    const password = await hashPassword('Password123!');

    /* ===== ADMIN ===== */
    console.log('👤 Seeding Admin...');
    const admin = await User.create({
      name: 'System Admin', email: 'admin@smartroad.com',
      password, role: 'admin', phone: '+254700000001',
    });
    console.log('  ✅ admin@smartroad.com / Password123!\n');

    /* ===== HOSPITALS ===== */
    console.log('🏥 Seeding Hospitals...');
    const hospitals = await User.insertMany([
      {
        name: 'Dr. James Mwangi', email: 'hospital1@smartroad.com', password,
        role: 'hospital', phone: '+254700000010',
        hospitalName: 'Nairobi General Hospital', registrationNumber: 'NGH-2024-001',
        address: 'Upper Hill, Nairobi', location: { lat: -1.2833, lng: 36.8167 },
        contactNumber: '+254700000010',
      },
      {
        name: 'Dr. Amina Hassan', email: 'hospital2@smartroad.com', password,
        role: 'hospital', phone: '+254700000011',
        hospitalName: 'Kenyatta National Hospital', registrationNumber: 'KNH-2024-002',
        address: 'Ngong Road, Nairobi', location: { lat: -1.3010, lng: 36.8060 },
        contactNumber: '+254700000011',
      },
      {
        name: 'Dr. Peter Ochieng', email: 'hospital3@smartroad.com', password,
        role: 'hospital', phone: '+254700000012',
        hospitalName: 'Aga Khan University Hospital', registrationNumber: 'AKH-2024-003',
        address: 'Parklands, Nairobi', location: { lat: -1.2636, lng: 36.8030 },
        contactNumber: '+254700000012',
      },
    ]);
    console.log(`  ✅ ${hospitals.length} hospitals seeded\n`);

    /* ===== DRIVERS ===== */
    console.log('🚗 Seeding Drivers...');
    const drivers = await User.insertMany([
      {
        name: 'John Kamau', email: 'driver1@smartroad.com', password,
        role: 'driver', phone: '+254711000001',
        licenseNumber: 'DL-2024-001', vehicleNumber: 'KCA 123A',
        emergencyContacts: [{ name: 'Mary Kamau', relationship: 'Wife', phone: '+254711000100', isPrimary: true }],
        medicalInfo: { bloodGroup: 'O+', allergies: [], medicalConditions: [] },
      },
      {
        name: 'Grace Wanjiku', email: 'driver2@smartroad.com', password,
        role: 'driver', phone: '+254711000002',
        licenseNumber: 'DL-2024-002', vehicleNumber: 'KCB 456B',
        emergencyContacts: [{ name: 'Tom Wanjiku', relationship: 'Husband', phone: '+254711000101', isPrimary: true }],
        medicalInfo: { bloodGroup: 'A+', allergies: ['Penicillin'], medicalConditions: [] },
      },
      {
        name: 'Samuel Otieno', email: 'driver3@smartroad.com', password,
        role: 'driver', phone: '+254711000003',
        licenseNumber: 'DL-2024-003', vehicleNumber: 'KCC 789C',
        emergencyContacts: [{ name: 'Ruth Otieno', relationship: 'Sister', phone: '+254711000102', isPrimary: true }],
        medicalInfo: { bloodGroup: 'B+', allergies: [], medicalConditions: ['Diabetes'] },
      },
      {
        name: 'Fatuma Ali', email: 'driver4@smartroad.com', password,
        role: 'driver', phone: '+254711000004',
        licenseNumber: 'DL-2024-004', vehicleNumber: 'KCD 321D',
        emergencyContacts: [{ name: 'Hassan Ali', relationship: 'Brother', phone: '+254711000103', isPrimary: true }],
        medicalInfo: { bloodGroup: 'AB+', allergies: [], medicalConditions: [] },
      },
      {
        name: 'David Muthoni', email: 'driver5@smartroad.com', password,
        role: 'driver', phone: '+254711000005',
        licenseNumber: 'DL-2024-005', vehicleNumber: 'KCE 654E',
        emergencyContacts: [{ name: 'Jane Muthoni', relationship: 'Mother', phone: '+254711000104', isPrimary: true }],
        medicalInfo: { bloodGroup: 'O-', allergies: [], medicalConditions: [] },
      },
    ]);
    console.log(`  ✅ ${drivers.length} drivers seeded\n`);

    /* ===== RESPONDERS ===== */
    console.log('🚑 Seeding Responders...');
    const responders = await User.insertMany([
      {
        name: 'Alex Njoroge', email: 'responder1@smartroad.com', password,
        role: 'responder', phone: '+254722000001', responderType: 'ambulance',
        hospitalId: hospitals[0]._id, certifications: ['EMT-Basic', 'CPR', 'ACLS'],
        experience: 5, currentLocation: { lat: -1.2921, lng: 36.8219 },
      },
      {
        name: 'Mercy Akinyi', email: 'responder2@smartroad.com', password,
        role: 'responder', phone: '+254722000002', responderType: 'ambulance',
        hospitalId: hospitals[0]._id, certifications: ['EMT-Paramedic', 'CPR', 'PHTLS'],
        experience: 8, currentLocation: { lat: -1.3031, lng: 36.7073 },
      },
      {
        name: 'Brian Kipchoge', email: 'responder3@smartroad.com', password,
        role: 'responder', phone: '+254722000003', responderType: 'ambulance',
        hospitalId: hospitals[1]._id, certifications: ['EMT-Basic', 'CPR'],
        experience: 3, currentLocation: { lat: -1.3192, lng: 36.8800 },
      },
      {
        name: 'Susan Chebet', email: 'responder4@smartroad.com', password,
        role: 'responder', phone: '+254722000004', responderType: 'police',
        hospitalId: hospitals[1]._id, certifications: ['First Aid', 'Crisis Management'],
        experience: 6, currentLocation: { lat: -1.2636, lng: 36.8030 },
      },
      {
        name: 'Kevin Omondi', email: 'responder5@smartroad.com', password,
        role: 'responder', phone: '+254722000005', responderType: 'fire',
        hospitalId: hospitals[2]._id, certifications: ['Fire Safety', 'EMT-Basic', 'Rescue Operations'],
        experience: 10, currentLocation: { lat: -1.2408, lng: 36.8800 },
      },
    ]);
    console.log(`  ✅ ${responders.length} responders seeded\n`);

    /* ===== AMBULANCES ===== */
    console.log('🚑 Seeding Ambulances...');
    const { Ambulance } = require('./models/Ambulance.model');
    await Ambulance.deleteMany({});
    await Ambulance.insertMany([
      { plateNumber: 'KCA 001A', make: 'Toyota', ambulanceModel: 'HiAce', year: 2022, status: 'available', driverName: 'Alex Njoroge', location: { lat: -1.2921, lng: 36.8219 } },
      { plateNumber: 'KCB 002B', make: 'Mercedes', ambulanceModel: 'Sprinter', year: 2021, status: 'dispatched', driverName: 'Mercy Akinyi', location: { lat: -1.3031, lng: 36.7073 } },
      { plateNumber: 'KCC 003C', make: 'Ford', ambulanceModel: 'Transit', year: 2020, status: 'maintenance', driverName: 'Brian Kipchoge' },
      { plateNumber: 'KCD 004D', make: 'Toyota', ambulanceModel: 'HiAce', year: 2023, status: 'available', driverName: 'Susan Chebet', location: { lat: -1.2636, lng: 36.8030 } },
      { plateNumber: 'KCE 005E', make: 'Nissan', ambulanceModel: 'Urvan', year: 2019, status: 'offline' },
    ]);
    console.log('  ✅ 5 ambulances seeded\n');

    /* ===== HISTORICAL INCIDENTS ===== */
    console.log('🚨 Seeding Historical Incidents...');
    const incidentTypes = ['collision', 'rollover', 'fire', 'medical', 'other'];
    const severities    = ['low', 'medium', 'high', 'critical', 'fatal'];
    const statuses      = ['pending', 'detected', 'confirmed', 'dispatched', 'en-route', 'arrived', 'resolved'];
    const vehicleMakes  = ['Toyota', 'Nissan', 'Isuzu', 'Mitsubishi', 'Subaru'];
    const vehicleModels = ['Corolla', 'Tiida', 'NPR', 'Canter', 'Forester'];
    const vehicleColors = ['White', 'Silver', 'Black', 'Blue', 'Red'];
    const incidents = [];

    for (let i = 0; i < 20; i++) {
      const driver   = drivers[i % drivers.length];
      const location = nairobiLocations[i % nairobiLocations.length];
      const status   = statuses[i % statuses.length];
      const severity = severities[i % severities.length];
      const type     = incidentTypes[i % incidentTypes.length];
      const hoursAgo = randomBetween(2, 72);
      const timestamp = new Date(Date.now() - hoursAgo * 3600000);

      const incident: any = {
        incidentId: `INC-2024-${String(i + 1).padStart(4, '0')}`,
        driverId: driver._id, driverName: driver.name, driverPhone: driver.phone,
        type, severity, status,
        location: { type: 'Point', coordinates: [location.lng + randomBetween(-0.01, 0.01), location.lat + randomBetween(-0.01, 0.01)] },
        locationAddress: location.address, timestamp, detectedAt: new Date(timestamp.getTime() + 30000),
        speed: Math.floor(randomBetween(0, 120)), impactForce: Math.floor(randomBetween(10, 100)),
        airbagDeployed: Math.random() > 0.5, occupants: Math.floor(randomBetween(1, 5)),
        injuries: Math.floor(randomBetween(0, 3)),
        fatalities: severity === 'fatal' ? Math.floor(randomBetween(1, 2)) : 0,
        vehicleNumber: driver.vehicleNumber,
        vehicleMake: vehicleMakes[i % vehicleMakes.length],
        vehicleModel: vehicleModels[i % vehicleModels.length],
        vehicleColor: vehicleColors[i % vehicleColors.length],
        hospitalId: hospitals[i % hospitals.length]._id,
        assignedHospital: (hospitals[i % hospitals.length] as any).hospitalName,
        emergencyContacts: [{ name: 'Emergency Contact', relationship: 'Family', phone: '+254700999000', isNotified: status !== 'pending' }],
        responders: [],
      };

      if (['dispatched', 'en-route', 'arrived', 'resolved'].includes(status)) {
        const responder = responders[i % responders.length];
        incident.responders = [{
          responderId: responder._id, name: responder.name,
          type: (responder as any).responderType,
          hospital: (hospitals[i % hospitals.length] as any).hospitalName,
          eta: Math.floor(randomBetween(5, 30)), distance: parseFloat(randomBetween(1, 15).toFixed(1)),
          status: status === 'resolved' ? 'completed' : 'en-route',
          location: { lat: location.lat, lng: location.lng },
          dispatchedAt: new Date(timestamp.getTime() + 120000),
        }];
        if (['arrived', 'resolved'].includes(status)) incident.confirmedAt = new Date(timestamp.getTime() + 60000);
        if (status === 'resolved') incident.resolvedAt = new Date(timestamp.getTime() + 3600000);
      }
      incidents.push(incident);
    }

    await Incident.insertMany(incidents);
    console.log(`  ✅ ${incidents.length} historical incidents seeded\n`);

    /* ===== LIVE INCIDENTS ===== */
    console.log('🔴 Seeding Live Incidents...');
    const now = new Date();
    const mins = (m: number) => m * 60 * 1000;

    const liveIncidents = [
      { incidentId: 'LIVE-001', driverId: drivers[0]._id, driverName: drivers[0].name, driverPhone: drivers[0].phone, type: 'collision', severity: 'critical', status: 'pending', location: { type: 'Point', coordinates: [36.8219, -1.2921] }, locationAddress: 'Uhuru Highway & Haile Selassie Ave, Nairobi CBD', timestamp: new Date(now.getTime() - mins(2)), detectedAt: new Date(now.getTime() - mins(2)), speed: 95, impactForce: 8.7, airbagDeployed: true, occupants: 3, injuries: 2, fatalities: 0, vehicleNumber: drivers[0].vehicleNumber, vehicleMake: 'Toyota', vehicleModel: 'Land Cruiser', vehicleColor: 'Black', hospitalId: hospitals[0]._id, assignedHospital: (hospitals[0] as any).hospitalName, responders: [], emergencyContacts: [{ name: 'Mary Kamau', relationship: 'Wife', phone: '+254711000100', isNotified: false }] },
      { incidentId: 'LIVE-002', driverId: drivers[1]._id, driverName: drivers[1].name, driverPhone: drivers[1].phone, type: 'rollover', severity: 'high', status: 'dispatched', location: { type: 'Point', coordinates: [36.8060, -1.3010] }, locationAddress: 'Ngong Road near Adams Arcade, Nairobi', timestamp: new Date(now.getTime() - mins(7)), detectedAt: new Date(now.getTime() - mins(7)), confirmedAt: new Date(now.getTime() - mins(5)), speed: 78, impactForce: 6.2, airbagDeployed: true, occupants: 2, injuries: 1, fatalities: 0, vehicleNumber: drivers[1].vehicleNumber, vehicleMake: 'Subaru', vehicleModel: 'Forester', vehicleColor: 'Blue', hospitalId: hospitals[1]._id, assignedHospital: (hospitals[1] as any).hospitalName, assignedAmbulance: 'KCB 002B', responders: [{ responderId: responders[0]._id, name: responders[0].name, type: 'ambulance', hospital: (hospitals[1] as any).hospitalName, eta: 8, distance: 3.4, status: 'dispatched', location: { lat: -1.2921, lng: 36.8219 }, dispatchedAt: new Date(now.getTime() - mins(4)) }], emergencyContacts: [{ name: 'Tom Wanjiku', relationship: 'Husband', phone: '+254711000101', isNotified: true }] },
      { incidentId: 'LIVE-003', driverId: drivers[2]._id, driverName: drivers[2].name, driverPhone: drivers[2].phone, type: 'medical', severity: 'critical', status: 'en-route', location: { type: 'Point', coordinates: [36.7073, -1.3031] }, locationAddress: 'Westlands Road, Nairobi', timestamp: new Date(now.getTime() - mins(15)), detectedAt: new Date(now.getTime() - mins(15)), confirmedAt: new Date(now.getTime() - mins(13)), speed: 0, airbagDeployed: false, occupants: 1, injuries: 1, fatalities: 0, vehicleNumber: drivers[2].vehicleNumber, vehicleMake: 'Nissan', vehicleModel: 'Tiida', vehicleColor: 'White', hospitalId: hospitals[0]._id, assignedHospital: (hospitals[0] as any).hospitalName, assignedAmbulance: 'KCA 001A', responders: [{ responderId: responders[1]._id, name: responders[1].name, type: 'ambulance', hospital: (hospitals[0] as any).hospitalName, eta: 3, distance: 1.1, status: 'en-route', location: { lat: -1.3010, lng: 36.7200 }, dispatchedAt: new Date(now.getTime() - mins(10)) }], emergencyContacts: [{ name: 'Ruth Otieno', relationship: 'Sister', phone: '+254711000102', isNotified: true }] },
      { incidentId: 'LIVE-004', driverId: drivers[3]._id, driverName: drivers[3].name, driverPhone: drivers[3].phone, type: 'collision', severity: 'high', status: 'arrived', location: { type: 'Point', coordinates: [36.8030, -1.2636] }, locationAddress: 'Parklands Avenue, Nairobi', timestamp: new Date(now.getTime() - mins(25)), detectedAt: new Date(now.getTime() - mins(25)), confirmedAt: new Date(now.getTime() - mins(22)), speed: 62, impactForce: 5.1, airbagDeployed: false, occupants: 4, injuries: 2, fatalities: 0, vehicleNumber: drivers[3].vehicleNumber, vehicleMake: 'Toyota', vehicleModel: 'Corolla', vehicleColor: 'Silver', hospitalId: hospitals[2]._id, assignedHospital: (hospitals[2] as any).hospitalName, assignedAmbulance: 'KCD 004D', responders: [{ responderId: responders[2]._id, name: responders[2].name, type: 'ambulance', hospital: (hospitals[2] as any).hospitalName, eta: 0, distance: 0, status: 'arrived', location: { lat: -1.2636, lng: 36.8030 }, dispatchedAt: new Date(now.getTime() - mins(20)) }], emergencyContacts: [{ name: 'Hassan Ali', relationship: 'Brother', phone: '+254711000103', isNotified: true }] },
      { incidentId: 'LIVE-005', driverId: drivers[4]._id, driverName: drivers[4].name, driverPhone: drivers[4].phone, type: 'fire', severity: 'medium', status: 'detected', location: { type: 'Point', coordinates: [36.8800, -1.2408] }, locationAddress: 'Kasarani Stadium Road, Nairobi', timestamp: new Date(now.getTime() - mins(1)), detectedAt: new Date(now.getTime() - mins(1)), speed: 45, impactForce: 3.8, airbagDeployed: false, occupants: 2, injuries: 0, fatalities: 0, vehicleNumber: drivers[4].vehicleNumber, vehicleMake: 'Isuzu', vehicleModel: 'NPR', vehicleColor: 'Red', hospitalId: hospitals[1]._id, assignedHospital: (hospitals[1] as any).hospitalName, responders: [], emergencyContacts: [{ name: 'Jane Muthoni', relationship: 'Mother', phone: '+254711000104', isNotified: false }] },
      { incidentId: 'LIVE-006', driverId: drivers[0]._id, driverName: drivers[0].name, driverPhone: drivers[0].phone, type: 'collision', severity: 'fatal', status: 'transporting', location: { type: 'Point', coordinates: [36.8360, -1.2990] }, locationAddress: 'Kilimani, Argwings Kodhek Road, Nairobi', timestamp: new Date(now.getTime() - mins(40)), detectedAt: new Date(now.getTime() - mins(40)), confirmedAt: new Date(now.getTime() - mins(38)), speed: 120, impactForce: 11.4, airbagDeployed: true, occupants: 2, injuries: 1, fatalities: 1, vehicleNumber: drivers[0].vehicleNumber, vehicleMake: 'Mercedes', vehicleModel: 'C-Class', vehicleColor: 'White', hospitalId: hospitals[0]._id, assignedHospital: (hospitals[0] as any).hospitalName, assignedAmbulance: 'KCA 001A', responders: [{ responderId: responders[3]._id, name: responders[3].name, type: 'ambulance', hospital: (hospitals[0] as any).hospitalName, eta: 5, distance: 2.1, status: 'transporting', location: { lat: -1.2833, lng: 36.8167 }, dispatchedAt: new Date(now.getTime() - mins(35)) }], emergencyContacts: [{ name: 'Mary Kamau', relationship: 'Wife', phone: '+254711000100', isNotified: true }] },
    ];

    await Incident.insertMany(liveIncidents);
    console.log(`  ✅ ${liveIncidents.length} live incidents seeded\n`);

    /* ===== AUDIT LOGS ===== */
    console.log('📋 Seeding Audit Logs...');

    const days = (d: number) => d * 24 * 60 * 60 * 1000;
    const hrs  = (h: number) => h * 60 * 60 * 1000;

    const auditLogs = [
      // Admin actions
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_CREATED', target: 'driver1@smartroad.com', targetId: drivers[0]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(7)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_CREATED', target: 'driver2@smartroad.com', targetId: drivers[1]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(7)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_CREATED', target: 'hospital1@smartroad.com', targetId: hospitals[0]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(6)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_CREATED', target: 'hospital2@smartroad.com', targetId: hospitals[1]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(6)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_CREATED', target: 'responder1@smartroad.com', targetId: responders[0]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(5)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_STATUS_TOGGLED', target: 'driver3@smartroad.com', targetId: drivers[2]._id, ipAddress: '192.168.1.1', metadata: { isActive: false }, createdAt: new Date(Date.now() - days(4)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_STATUS_TOGGLED', target: 'driver3@smartroad.com', targetId: drivers[2]._id, ipAddress: '192.168.1.1', metadata: { isActive: true }, createdAt: new Date(Date.now() - days(3)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_DELETED', target: 'testuser@smartroad.com', ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(3)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'SYSTEM_HEALTH_CHECKED', target: 'system', ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(2)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'REPORT_GENERATED', target: 'incidents', ipAddress: '192.168.1.1', metadata: { type: 'incidents', format: 'pdf' }, createdAt: new Date(Date.now() - days(2)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'USER_UPDATED', target: 'driver4@smartroad.com', targetId: drivers[3]._id, ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - days(1)) },
      { actorId: admin._id, actorName: admin.name, actorRole: 'admin', action: 'EXPORT_CREATED', target: 'users', ipAddress: '192.168.1.1', metadata: { type: 'users', format: 'csv' }, createdAt: new Date(Date.now() - hrs(20)) },

      // Hospital actions
      { actorId: hospitals[0]._id, actorName: hospitals[0].name, actorRole: 'hospital', action: 'INCIDENT_ACCEPTED', target: 'INC-2024-0001', ipAddress: '192.168.1.10', createdAt: new Date(Date.now() - days(5)) },
      { actorId: hospitals[0]._id, actorName: hospitals[0].name, actorRole: 'hospital', action: 'RESPONDER_DISPATCHED', target: 'Alex Njoroge', targetId: responders[0]._id, ipAddress: '192.168.1.10', createdAt: new Date(Date.now() - days(4)) },
      { actorId: hospitals[0]._id, actorName: hospitals[0].name, actorRole: 'hospital', action: 'INCIDENT_RESOLVED', target: 'INC-2024-0003', ipAddress: '192.168.1.10', createdAt: new Date(Date.now() - days(3)) },
      { actorId: hospitals[1]._id, actorName: hospitals[1].name, actorRole: 'hospital', action: 'INCIDENT_ACCEPTED', target: 'INC-2024-0002', ipAddress: '192.168.1.11', createdAt: new Date(Date.now() - days(2)) },
      { actorId: hospitals[1]._id, actorName: hospitals[1].name, actorRole: 'hospital', action: 'CAPACITY_UPDATED', target: 'Kenyatta National Hospital', ipAddress: '192.168.1.11', metadata: { beds: 120, ambulances: 8 }, createdAt: new Date(Date.now() - days(1)) },
      { actorId: hospitals[2]._id, actorName: hospitals[2].name, actorRole: 'hospital', action: 'RESPONDER_DISPATCHED', target: 'Brian Kipchoge', targetId: responders[2]._id, ipAddress: '192.168.1.12', createdAt: new Date(Date.now() - hrs(18)) },

      // Driver actions
      { actorId: drivers[0]._id, actorName: drivers[0].name, actorRole: 'driver', action: 'INCIDENT_CREATED', target: 'LIVE-001', ipAddress: '41.212.100.50', createdAt: new Date(Date.now() - hrs(2)) },
      { actorId: drivers[1]._id, actorName: drivers[1].name, actorRole: 'driver', action: 'INCIDENT_CREATED', target: 'LIVE-002', ipAddress: '41.212.100.51', createdAt: new Date(Date.now() - hrs(1)) },
      { actorId: drivers[2]._id, actorName: drivers[2].name, actorRole: 'driver', action: 'INCIDENT_CANCELLED', target: 'INC-2024-0010', ipAddress: '41.212.100.52', createdAt: new Date(Date.now() - days(1)) },
      { actorId: drivers[3]._id, actorName: drivers[3].name, actorRole: 'driver', action: 'PROFILE_UPDATED', target: 'driver4@smartroad.com', ipAddress: '41.212.100.53', createdAt: new Date(Date.now() - hrs(5)) },
      { actorId: drivers[0]._id, actorName: drivers[0].name, actorRole: 'driver', action: 'EMERGENCY_CONTACT_ADDED', target: 'Mary Kamau', ipAddress: '41.212.100.50', createdAt: new Date(Date.now() - days(3)) },

      // Responder actions
      { actorId: responders[0]._id, actorName: responders[0].name, actorRole: 'responder', action: 'INCIDENT_ARRIVED', target: 'INC-2024-0004', ipAddress: '41.212.200.10', createdAt: new Date(Date.now() - days(2)) },
      { actorId: responders[1]._id, actorName: responders[1].name, actorRole: 'responder', action: 'INCIDENT_RESOLVED', target: 'INC-2024-0007', ipAddress: '41.212.200.11', createdAt: new Date(Date.now() - days(1)) },
      { actorId: responders[2]._id, actorName: responders[2].name, actorRole: 'responder', action: 'LOCATION_UPDATED', target: 'LIVE-003', ipAddress: '41.212.200.12', createdAt: new Date(Date.now() - hrs(3)) },
      { actorId: responders[0]._id, actorName: responders[0].name, actorRole: 'responder', action: 'INCIDENT_TRANSPORTING', target: 'LIVE-006', ipAddress: '41.212.200.10', createdAt: new Date(Date.now() - hrs(1)) },
    ];

    await AuditLog.insertMany(auditLogs);
    console.log(`  ✅ ${auditLogs.length} audit log entries seeded\n`);

    /* ===== SUMMARY ===== */
    const totalIncidents = incidents.length + liveIncidents.length;
    console.log('═══════════════════════════════════════════');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 LOGIN CREDENTIALS (all use Password123!)');
    console.log('ADMIN:      admin@smartroad.com');
    console.log('\nHOSPITALS:');
    console.log('  hospital1@smartroad.com  → Nairobi General Hospital');
    console.log('  hospital2@smartroad.com  → Kenyatta National Hospital');
    console.log('  hospital3@smartroad.com  → Aga Khan University Hospital');
    console.log('\nDRIVERS:    driver1 ~ driver5@smartroad.com');
    console.log('RESPONDERS: responder1 ~ responder5@smartroad.com');
    console.log(`\n📊 Users:      ${1 + hospitals.length + drivers.length + responders.length}`);
    console.log(`📊 Incidents:  ${totalIncidents} (${incidents.length} historical + ${liveIncidents.length} live)`);
    console.log(`📊 Audit Logs: ${auditLogs.length}`);
    console.log('═══════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();