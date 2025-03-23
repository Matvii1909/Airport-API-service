from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from airport.models import Airport, Route, Airplane, Flight, Crew
from airport.serializers import AirportSerializer, RouteSerializer, AirplaneSerializer, FlightSerializer

AIRPORT_URL = reverse("airport-list")
ROUTE_URL = reverse("route-list")
AIRPLANE_URL = reverse("airplane-list")
FLIGHT_URL = reverse("flight-list")


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

    def test_list_airports(self):
        sample_airport()
        sample_airport()

        res = self.client.get(AIRPORT_URL)

        airports = Airport.objects.order_by("id")
        serializer = AirportSerializer(airports, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_airport_forbidden(self):
        payload = {"name": "New Airport", "closest_big_city": "New City"}
        res = self.client.post(AIRPORT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class AdminAirportApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            "admin@admin.com", "testpass", is_staff=True
        )
        self.client.force_authenticate(self.user)

    def test_create_airport(self):
        payload = {"name": "New Airport", "closest_big_city": "New City"}
        res = self.client.post(AIRPORT_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        airport = Airport.objects.get(id=res.data["id"])
        for key in payload.keys():
            self.assertEqual(payload[key], getattr(airport, key))