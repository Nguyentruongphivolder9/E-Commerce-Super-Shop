import 'package:sqflite/sqflite.dart';

const String createUserTable = '''
  CREATE TABLE account (
  id TEXT PRIMARY KEY, 
  userName TEXT,
  avatarUrl TEXT,
  roleName TEXT,
  fullName TEXT,
  email TEXT,
  phoneNumber TEXT,
  birthDay TEXT, 
  gender TEXT,
  isActive INTEGER,
  isLoggedOut INTEGER, 
  isEnable INTEGER, 
  isMerege INTEGER,
  userFullNameChanges INTEGER,
  provider TEXT
)
''';

const String createDeviceTable = '''
  CREATE TABLE device (
    city TEXT,
    country TEXT,
    deviceFingerPrint TEXT,
    ipAddress TEXT,
    latitude TEXT,
    longitude TEXT,
    region TEXT,
    regionName TEXT,
    browserName TEXT,
    deviceType TEXT
  )
''';

const String createAddressTable = '''
  CREATE TABLE address (
    _id TEXT PRIMARY KEY,
    addressType TEXT,
    location TEXT,
    fullName TEXT,
    phoneNumber TEXT,
    isDefault INTEGER,
    pickupLocation INTEGER
  )
''';

const String createAccessTokenTable = '''
  CREATE TABLE access_token (
    _id TEXT PRIMARY KEY,
    token KEY,
    refreshToken TEXT,
    expiresIn INTEGER,
    issuedAt INTEGER,
    expiresAt INTEGER,
    secretKey BLOB
  )
''';
