from datetime import datetime

from rest_framework import viewsets, mixins, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import GenericViewSet
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response

from airport.models import Airport, Route, Type, Airplane, Crew, Flight, Order
from airport.permissions import IsAdminALLORIsAuthenticatedOReadOnly
from airport.serializers import (
    AirportSerializer,
    RouteSerializer,
    TypeSerializer,
    AirplaneSerializer,
    CrewSerializer,
    FlightSerializer,
    OrderSerializer,
    OrderListSerializer, TicketListSerializer, AirplaneImageSerializer, AirplaneListSerializer,
    AirplaneDetailSerializer,
)


class AirportViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    permission_classes = (IsAdminALLORIsAuthenticatedOReadOnly,)
    
    def get_permissions(self):
        if self.action == 'list':
            return []  # Allow public access to list airports
        return super().get_permissions()


class TypeViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = (IsAdminALLORIsAuthenticatedOReadOnly,)


class RouteViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = (IsAdminUser,)


class AirplaneViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Airplane.objects.prefetch_related("types")
    serializer_class = AirplaneSerializer
    permission_classes = (IsAdminALLORIsAuthenticatedOReadOnly,)
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []  # Allow public access to list and retrieve airplanes
        return super().get_permissions()

    @staticmethod
    def _params_to_ints(qs):
        """Converts a list of string IDs to a list of integers"""
        return [int(str_id) for str_id in qs.split(",")]

    def get_queryset(self):
        """Retrieve the airplanes with filters"""
        name = self.request.query_params.get("name")
        types = self.request.query_params.get("types")

        queryset = self.queryset

        if name:
            queryset = queryset.filter(name__icontains=name)

        if types:
            types_names = types.split(",")
            queryset = queryset.filter(types__name__in=types_names)

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "list":
            return AirplaneListSerializer

        if self.action == "retrieve":
            return AirplaneDetailSerializer

        if self.action == "upload_image":
            return AirplaneImageSerializer

        return AirplaneSerializer

    @action(
        methods=["POST"],
        detail=True,
        url_path="upload-image",
        permission_classes=[IsAdminUser],
    )
    def upload_image(self, request, pk=None):
        """Endpoint for uploading image to specific airplane"""
        airplane = self.get_object()
        serializer = self.get_serializer(airplane, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                "types",
                type={"type": "string"},
                description="Filter by airplane type name (ex. ?types=Boeing,Airbus)",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        """Get list of airplanes"""
        return super().list(request, *args, **kwargs)


class CrewViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Crew.objects.all()
    serializer_class = CrewSerializer
    permission_classes = (IsAdminUser,)


class FlightViewSet(viewsets.ModelViewSet):
    queryset = (
        Flight.objects.all()
        .select_related("route", "airplane")
        .prefetch_related("crew")
    )
    serializer_class = FlightSerializer
    permission_classes = (IsAdminUser,)
    
    def get_permissions(self):
        if self.action == 'list':
            return []  # Allow public access to list flights
        return super().get_permissions()

    def get_queryset(self):
        departure_date = self.request.query_params.get("departure_date")
        route_id = self.request.query_params.get("route")

        queryset = self.queryset

        if departure_date:
            departure_date = datetime.strptime(departure_date, "%Y-%m-%d").date()
            queryset = queryset.filter(departure_time__date=departure_date)

        if route_id:
            queryset = queryset.filter(route_id=int(route_id))

        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                "route",
                type=OpenApiTypes.INT,
                description="Filter by route id (e.g., ?route=2)",
            ),
            OpenApiParameter(
                "departure_date",
                type=OpenApiTypes.DATE,
                description="Filter by departure date (e.g., ?departure_date=2024-12-25)",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class OrderPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 100


class OrderViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Order.objects.prefetch_related(
        "tickets__flight__route", "tickets__flight__airplane"
    )
    serializer_class = OrderSerializer
    pagination_class = OrderPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return OrderListSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
