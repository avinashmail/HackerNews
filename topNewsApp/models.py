from __future__ import unicode_literals

from django.db import models

# Create your models here.
from mongoengine import *
from HackerNews.settings import DBNAME

connect(DBNAME)


class News(Document):

    news_id = LongField(required=True)
    username = StringField(required=True)
    title = StringField(required=True)
    url = StringField()
    score = IntField()
    description = StringField()
    descendants = IntField()
    confidence = FloatField()
    sentiment = StringField(required=True)
    # news_date = DateTimeField(required=True)
    # descendants = IntField(required=True)
    # type = StringField(max_length=20)
    meta = {'indexes': [
        {'fields': ['$title'],
         'default_language': 'english',
         'weights': {'title': 10}
         }
    ]}