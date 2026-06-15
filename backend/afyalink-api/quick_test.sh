#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000/api/v1"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔐 AfyaLink API Quick Test${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Login to get token
echo -e "\n${BLUE}📋 Step 1: Login to get access token${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "Test@123456"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Login failed! Please check your credentials.${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Login successful!${NC}"
echo -e "Access Token: ${ACCESS_TOKEN:0:50}...\n"

# Step 2: Test /users/me
echo -e "${BLUE}📋 Step 2: Get current user info (Protected)${NC}"
USER_RESPONSE=$(curl -s -X GET $BASE_URL/users/me \
  -H "accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$USER_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅ Successfully retrieved user info${NC}"
    echo "$USER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$USER_RESPONSE"
else
    echo -e "${RED}❌ Failed to get user info${NC}"
    echo "$USER_RESPONSE"
fi

# Step 3: Test /doctors
echo -e "\n${BLUE}📋 Step 3: Get doctors list (Protected)${NC}"
DOCTORS_RESPONSE=$(curl -s -X GET $BASE_URL/doctors \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$DOCTORS_RESPONSE" | grep -q "\[\|\]"; then
    echo -e "${GREEN}✅ Successfully retrieved doctors list${NC}"
    echo "$DOCTORS_RESPONSE" | python3 -m json.tool 2>/dev/null | head -20
else
    echo -e "${RED}❌ Failed to get doctors list${NC}"
    echo "$DOCTORS_RESPONSE"
fi

# Step 4: Test /appointments
echo -e "\n${BLUE}📋 Step 4: Get appointments (Protected)${NC}"
APPOINTMENTS_RESPONSE=$(curl -s -X GET $BASE_URL/appointments \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$APPOINTMENTS_RESPONSE" | grep -q "\[\|\]"; then
    echo -e "${GREEN}✅ Successfully retrieved appointments${NC}"
    echo "$APPOINTMENTS_RESPONSE" | python3 -m json.tool 2>/dev/null | head -20
else
    echo -e "${RED}❌ Failed to get appointments${NC}"
    echo "$APPOINTMENTS_RESPONSE"
fi

# Step 5: Create an appointment
echo -e "\n${BLUE}📋 Step 5: Create a new appointment${NC}"
# Get future date (tomorrow)
FUTURE_DATE=$(date -d "+1 day" +"%Y-%m-%dT10:00:00")

CREATE_APPT_RESPONSE=$(curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"doctor_id\": 1,
    \"scheduled_time\": \"$FUTURE_DATE\",
    \"duration_minutes\": 30,
    \"appointment_type\": \"video\",
    \"reason\": \"Regular checkup\",
    \"symptoms\": \"Feeling well, routine check\"
  }")

if echo "$CREATE_APPT_RESPONSE" | grep -q "id"; then
    echo -e "${GREEN}✅ Successfully created appointment${NC}"
    echo "$CREATE_APPT_RESPONSE" | python3 -m json.tool 2>/dev/null
else
    echo -e "${RED}❌ Failed to create appointment${NC}"
    echo "$CREATE_APPT_RESPONSE"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Testing complete!${NC}"
echo -e "${BLUE}========================================${NC}"