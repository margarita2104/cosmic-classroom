# Generated by Django 5.1.1 on 2024-10-06 14:41

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("lesson", "0003_alter_lesson_created_lesson"),
    ]

    operations = [
        migrations.AddField(
            model_name="lesson",
            name="user_prompt",
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="class_length",
            field=models.PositiveIntegerField(
                blank=True,
                choices=[(30, "30 minutes"), (45, "45 minutes"), (90, "90 minutes")],
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="class_size",
            field=models.PositiveIntegerField(
                blank=True,
                choices=[
                    (10, "5 - 10 students"),
                    (20, "10 - 20 students"),
                    (50, "20 - 50 students"),
                ],
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="grade_level",
            field=models.CharField(
                blank=True,
                choices=[
                    ("elementary_school", "Elementary School"),
                    ("middle_school", "Middle School"),
                    ("high_school", "High School"),
                ],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="learning_styles",
            field=models.CharField(
                blank=True,
                choices=[
                    ("visual", "Visual"),
                    ("auditory", "Auditory"),
                    ("kinesthetic", "Kinesthetic"),
                ],
                max_length=100,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="subject",
            field=models.CharField(
                blank=True,
                choices=[
                    ("exoplanets_types", "Exoplanet Types"),
                    ("exoplanets_discovery", "Exoplanet Discovery"),
                    ("exoplanets_habitability", "Exoplanet Habitability"),
                ],
                max_length=50,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="lesson",
            name="technology_access",
            field=models.CharField(
                blank=True,
                choices=[
                    ("unavailable", "No technology available (offline)"),
                    ("limited", "Limited access"),
                    ("full", "Full access"),
                ],
                max_length=100,
                null=True,
            ),
        ),
    ]
