from django.shortcuts import render
from django.http import HttpResponse
import json
import ast
import datetime
# from django.utils import simplejson
from models import News
from mongoengine import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging
log = logging.getLogger('topNewsApp')
# Create your views here.


def index(request):
    return render(request, 'index.html')


def top_news(request):
    return render(request, 'top_news.html')


class TopNewsId(APIView):
    def post(self, request):
        try:
            top_news_ids = request.data
            top_news_ids = json.dumps(top_news_ids)
            top_news_ids = ast.literal_eval(top_news_ids)
            top_news_ids = top_news_ids.keys()[0]
            top_news_ids = ast.literal_eval(top_news_ids)
            top_new_news_id_list = []
            for news_id in top_news_ids:
                news_id = long(news_id)
                a = News.objects(news_id=news_id).first()
                # News.objects(news_id=news_id).delete()
                if not a:
                    top_new_news_id_list.append(news_id)
            return Response({"new_news_id": top_new_news_id_list})
        except Exception, e:
            log.debug(str(e) + " IN TopNewsIdApi ")
            return Response({"status": "failure"})


class SaveDetails(APIView):
    def post(self, request):
        try:
            news_details = request.data
            news_details = json.dumps(news_details)
            news_details = ast.literal_eval(news_details)
            news_details = news_details.keys()[0]
            news_details = ast.literal_eval(news_details)

            news = News(
                news_id=long(news_details["news_id"]),
                username=news_details["username"],
                title=news_details["title"],
                url=news_details["url"] if "url" in news_details else '',
                score=int(news_details["score"]) if "score" in news_details else 0,
                description=news_details["description"] if "description" in news_details else '',
                descendants=int(news_details["descendants"]) if "descendants" in news_details else 0,
                confidence=float(news_details["confidence"]) if "confidence" in news_details else 0,
                sentiment=news_details["sentiment"] if "sentiment" in news_details else '',
            )
            news.save()
            return Response({"status": "success"})
        except Exception, e:
            log.debug(str(e) + " IN SaveDetailsApi ")
            return Response({"status": "failure"})


class DisplayNews(APIView):
    def post(self, request):
        try:
            top_news_ids = request.data
            top_news_ids = json.dumps(top_news_ids)
            top_news_ids = ast.literal_eval(top_news_ids)
            top_news_ids = top_news_ids.keys()[0]
            top_news_ids = ast.literal_eval( top_news_ids)
            top_news_list = []
            for news_id in top_news_ids:
                a = News.objects(news_id=news_id).first()
                if a:
                    news_details_json = {"news_id": a.news_id, "username": a.username, "title": a.title, "url": a.url,
                                          "score": a.score, "description": a.description, "descendants": a.descendants,
                                          "confidence": a.confidence, "sentiment": a.sentiment}
                    top_news_list.append(news_details_json)
            return Response({"status": "success", "top_news_list": top_news_list})
        except Exception, e:
            log.debug(str(e) + " IN DisplayNewsApi ")
            return Response({"status": "failure"})


class SearchQuery(APIView):
    def post(self, request):
        try:
            search_text = request.data
            search_text = json.dumps(search_text)
            search_text = ast.literal_eval(search_text)
            search_text = search_text.keys()[0]
            search_text = ast.literal_eval(search_text)
            search_text = search_text["search_text"]
            objects = News.objects.search_text(search_text).order_by('$text_score').all()
            search_list = []
            for obj in objects:
                tmp = {"title": obj.title, "sentiment": obj.sentiment, "url": obj.url}
                search_list.append(tmp)
            return Response({"status": "success", "search_list": search_list})
        except Exception, e:
            log.debug(str(e) + " IN SearchQueryApi ")
            return Response({"status": "failure"})