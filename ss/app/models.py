from django.db import models
from django.contrib.auth.models import User

class City(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'cities'

class Vote(models.Model):
    VOTE_TYPES = (
        ('positive', 'Positive'),
        ('negative', 'Negative')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=8, choices=VOTE_TYPES)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f'{self.user.username} - {self.event.name} - {self.vote_type}'


class Event(models.Model):
    name = models.CharField(max_length=50)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='events')
    date = models.DateField(auto_now_add=True)
    description = models.TextField(blank=False, null=False)
    latitude = models.FloatField(blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)
    pos_votes = models.PositiveIntegerField(default=0)
    neg_votes = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='images/', blank=False, null=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-date']

    def update_votes(self):
        if self.pk:
            self.pos_votes = self.votes.filter(vote_type='positive').count()
            self.neg_votes = self.votes.filter(vote_type='negative').count()
            super().save(update_fields=['pos_votes', 'neg_votes']) 

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.pk:
            self.update_votes()
