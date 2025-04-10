from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from airport.models import (
    Airport,
    Route,
    Type,
    Airplane,
    Crew,
    Flight,
    Ticket,
    Order,
)


class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ("id", "name", "closest_big_city")


class RouteSerializer(serializers.ModelSerializer):
    source_name = serializers.CharField(source="source.name", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = Route
        fields = ("id", "source", "destination", "distance", "source_name", "destination_name")


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ("id", "name")


class AirplaneSerializer(serializers.ModelSerializer):
    # airplane_type = AirplaneTypeSerializer(many=True, read_only=True)
    # capacity = serializers.IntegerField(read_only=True)

    class Meta:
        model = Airplane
        fields = (
            "id",
            "name",
            "rows",
            "seats_in_row",
            "types",
            "capacity",
            "image",
        )


class AirplaneListSerializer(AirplaneSerializer):
    types = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )


    class Meta:
        model = Airplane
        fields = (
            "id",
            "name",
            "rows",
            "seats_in_row",
            "types",
            "capacity",
            "image",
        )


class AirplaneDetailSerializer(AirplaneSerializer):
    types = TypeSerializer(many=True, read_only=True)

    class Meta:
        model = Airplane
        fields = (
            "id",
            "name",
            "rows",
            "seats_in_row",
            "types",
            "image",
        )


class AirplaneImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airplane
        fields = ("id", "image")


class CrewSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Crew
        fields = ("id", "first_name", "last_name", "full_name")

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class FlightSerializer(serializers.ModelSerializer):
    route_details = RouteSerializer(source="route", read_only=True)
    airplane_details = AirplaneSerializer(source="airplane", read_only=True)
    crew_members = CrewSerializer(source="crew", many=True, read_only=True)

    class Meta:
        model = Flight
        fields = (
            "id", "route", "airplane", "departure_time", "arrival_time",
            "route_details", "airplane_details", "crew_members",
        )


class TicketSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        required_keys = ["row", "seat", "flight"]
        missing_keys = [key for key in required_keys if key not in attrs]

        if missing_keys:
            raise ValidationError({key: f"{key} is required." for key in missing_keys})

        flight = attrs["flight"]
        airplane = flight.airplane
        if attrs["row"] > airplane.rows or attrs["seat"] > airplane.seats_in_row:
            raise ValidationError("Invalid row or seat number for this airplane.")

        return super(TicketSerializer, self).validate(attrs)

    class Meta:
        model = Ticket
        fields = ("id", "row", "seat", "flight")


class TicketListSerializer(TicketSerializer):
    flight = FlightSerializer(many=False, read_only=True)


class OrderSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=False, allow_empty=False)

    class Meta:
        model = Order
        fields = ("id", "tickets", "created_at")

    def create(self, validated_data):
        with transaction.atomic():
            tickets_data = validated_data.pop("tickets")
            order = Order.objects.create(**validated_data)
            for ticket_data in tickets_data:
                Ticket.objects.create(order=order, **ticket_data)
            return order


class OrderListSerializer(OrderSerializer):
    tickets = TicketListSerializer(many=True, read_only=True)
