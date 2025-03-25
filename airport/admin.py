from django.contrib import admin
from .models import (
    Airport,
    Route,
    Type,
    Airplane,
    Crew,
    Flight,
    Order,
    Ticket,
)


@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "closest_big_city")
    search_fields = ("name", "closest_big_city")


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("id", "source", "destination", "distance")
    search_fields = ("source__name", "destination__name")
    list_filter = ("source", "destination")


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Airplane)
class AirplaneAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "rows", "seats_in_row", "capacity")
    search_fields = ("name", "type__name")
    list_filter = ("types",)


@admin.register(Crew)
class CrewAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name")
    search_fields = ("first_name", "last_name")


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ("id", "route", "airplane", "departure_time", "arrival_time")
    search_fields = ("route__source__name", "route__destination__name", "airplane__name")
    list_filter = ("route", "airplane")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "created_at", "user")
    search_fields = ("user__username",)
    list_filter = ("created_at",)


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "flight", "order", "row", "seat")
    search_fields = ("flight__route__source__name", "flight__route__destination__name", "order__user__username")
    list_filter = ("flight", "order")
