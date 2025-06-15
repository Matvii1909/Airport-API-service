from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from airport.models import Airport, Route, Airplane, Flight, Crew, Type
from airport.serializers import AirportSerializer, RouteSerializer, AirplaneSerializer, FlightSerializer, \
    AirplaneListSerializer, AirplaneDetailSerializer

AIRPORT_URL = reverse("airport:airport-list")
ROUTE_URL = reverse("airport:route-list")
AIRPLANE_URL = reverse("airport:airplane-list")
FLIGHT_URL = reverse("airport:flight-list")


def sample_airport(**params):
    defaults = {
        "name": "Sample Airport",
        "closest_big_city": "Sample City",
    }
    defaults.update(params)
    return Airport.objects.create(**defaults)


def sample_route(**params):
    source = sample_airport(name="Source Airport")
    destination = sample_airport(name="Destination Airport")
    defaults = {
        "source": source,
        "destination": destination,
        "distance": 500,
    }
    defaults.update(params)
    return Route.objects.create(**defaults)


def sample_airplane(**params):
    defaults = {
        "name": "Boeing 747",
        "rows": 30,
        "seats_in_row": 6,
    }
    defaults.update(params)

    return Airplane.objects.create(**defaults)


def detail_url(airplane_id):
    return reverse("airport:airplane-detail", args=(airplane_id,))


def sample_flight(**params):
    route = sample_route()
    airplane = sample_airplane()
    defaults = {
        "route": route,
        "airplane": airplane,
        "departure_time": "2024-06-02 14:00:00",
        "arrival_time": "2024-06-02 18:00:00",
    }
    defaults.update(params)
    return Flight.objects.create(**defaults)


class UnauthenticatedAirportApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        res = self.client.get(AIRPORT_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthenticatedAirportApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            "test@test.com",
            "testpass",
        )
        self.client.force_authenticate(self.user)

    def test_airplanes_list(self):
        sample_airplane()
        airplane_with_airplane_types = sample_airplane()

        airplane_type_1 = Type.objects.create(name="Magic Aircraft")
        airplane_type_2 = Type.objects.create(name="Plastic Aircraft")

        airplane_with_airplane_types.types.add(airplane_type_1, airplane_type_2)

        res = self.client.get(AIRPLANE_URL)

        airplanes = Airplane.objects.all()
        serializer = AirplaneListSerializer(airplanes, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_filter_airplanes_by_types(self):
        airplane_type_1 = Type.objects.create(name="Aircraft X")
        airplane_type_2 = Type.objects.create(name="Aircraft Y")

        airplane_1 = sample_airplane(name="Aircraft 10-57")
        airplane_2 = sample_airplane(name="Aircraft 10-58")

        airplane_1.types.add(airplane_type_1)
        airplane_2.types.add(airplane_type_2)

        airplane_without_type = sample_airplane(name="Airplane without type")

        res = self.client.get(
            AIRPLANE_URL,
            {"types": f"{airplane_type_1.name},{airplane_type_2.name}"},
        )

        serializer_without_aircraft_type = AirplaneListSerializer(airplane_without_type)
        serializer_aircraft_type_1 = AirplaneListSerializer(airplane_1)
        serializer_aircraft_type_2 = AirplaneListSerializer(airplane_2)

        self.assertIn(serializer_aircraft_type_1.data, res.data)
        self.assertIn(serializer_aircraft_type_2.data, res.data)
        self.assertNotIn(serializer_without_aircraft_type.data, res.data)

    def test_retrieve_airplane_details(self):
        airplane = sample_airplane()
        airplane.types.add(Type.objects.create(name="Transporter"))

        url = detail_url(airplane.id)

        res = self.client.get(url)

        serializer = AirplaneDetailSerializer(airplane)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_airplane_forbidden(self):
        payload = {
            "name": "Airplane X",
            "rows": 30,
            "seats_in_row": 6,
            "types": ["Civil Craft", ],
        }

        res = self.client.post(AIRPLANE_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class AdminAirplaneTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="admin@admin.com", password="testpass", is_staff=True
        )
        self.client.force_authenticate(self.user)

    def test_create_airplane(self):

        payload = {
            "name": "Airplane X",
            "rows": 30,
            "seats_in_row": 6,
        }

        res = self.client.post(AIRPLANE_URL, payload)

        airplane = Airplane.objects.get(id=res.data["id"])

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        for key in payload.keys():
            self.assertEqual(payload[key], getattr(airplane, key))

    def test_create_airplane_with_types(self):
        airplane_type_1 = Type.objects.create(name="Magic Aircraft")
        airplane_type_2 = Type.objects.create(name="Plastic Aircraft")

        payload = {
            "name": "Airplane X",
            "rows": 30,
            "seats_in_row": 6,
            "types": [airplane_type_1.id, airplane_type_2.id]
        }

        res = self.client.post(AIRPLANE_URL, payload)

        airplane = Airplane.objects.get(id=res.data["id"])
        types = airplane.types.all()

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn(airplane_type_1, types)
        self.assertIn(airplane_type_2, types)
        self.assertEqual(types.count(), 2)

    def test_delete_airplane_now_allowed(self):
        airplane = sample_airplane()

        url = detail_url(airplane.id)

        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
