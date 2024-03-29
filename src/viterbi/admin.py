from django.contrib import admin
from .models import ViterbiJob, DataParameter, Label, SearchParameter, Data, Search, ViterbiSummaryResults


# Register your models here.


class InlineDataAdmin(admin.TabularInline):
    model = Data


class InlineSearchAdmin(admin.TabularInline):
    model = Search


class InlineDataParameterAdmin(admin.TabularInline):
    model = DataParameter


class InlineSearchParameterAdmin(admin.TabularInline):
    model = SearchParameter


@admin.register(Data)
class DataAdmin(admin.ModelAdmin):
    fields = ['job', 'data_source', 'source_dataset']
    inlines = (InlineDataParameterAdmin,)


@admin.register(Search)
class SearchAdmin(admin.ModelAdmin):
    fields = ['job']
    inlines = (InlineSearchParameterAdmin,)


@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    fields = ['name', 'description']


@admin.register(ViterbiJob)
class ViterbiJobAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'private', 'job_controller_id']
    filter_horizontal = ('labels',)
    readonly_fields = ('creation_time', 'last_updated')
    inlines = (
        InlineDataAdmin,
        InlineSearchAdmin,
        InlineDataParameterAdmin,
        InlineSearchParameterAdmin
    )


@admin.register(ViterbiSummaryResults)
class ViterbiSummaryResultsAdmin(admin.ModelAdmin):
    fields = ['job', 'table_data', 'plot_data']
