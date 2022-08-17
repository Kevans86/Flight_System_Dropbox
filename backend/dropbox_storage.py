    
from django.core.files import File
from django.core.files.storage import Storage
import dropbox
import time
from django.conf import settings
# from dropbox.files import FolderMetadata, FileMetadata, DeleteError
from dropbox.exceptions import ApiError


try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO
from django.utils.deconstruct import deconstructible  

DROPBOX_APP_KEY = getattr(settings, 'DROPBOX_APP_KEY', None)
DROPBOX_APP_SECRET = getattr(settings, 'DROPBOX_APP_SECRET', None)
DROPBOX_OAUTH2_REFRESH_TOKEN = getattr(settings, 'DROPBOX_OAUTH2_REFRESH_TOKEN', None)

        # """
        # Save new content to the file specified by name. The content should be
        # a proper File object or any Python file-like object, ready to be read
        # from the beginning.
        # """

@deconstructible
class DropboxStorage(Storage):

    def __init__(self, appkey=DROPBOX_APP_KEY, appsecret=DROPBOX_APP_SECRET, refreshtoken=DROPBOX_OAUTH2_REFRESH_TOKEN ):
        self.dbx = dropbox.Dropbox(
            app_key = appkey,
            app_secret = appsecret,
            oauth2_refresh_token = refreshtoken
                )
        self.location = "/"


    def _save(self, name, content):


        abs_name= f"/{name}"
        self.dbx.files_upload(content.read(), abs_name)
        
        #delay for compleeting upload 
        time.sleep(4)
        shared_link_metadata = self.dbx.sharing_create_shared_link_with_settings(abs_name)

        shared_link_metadata = shared_link_metadata.url
        shared_link_metadata = shared_link_metadata.replace("dl=0", "raw=1")
        
        name = shared_link_metadata.split("/s/")[1]
        #replace dl=0 to raw=1 to display the image
        
        return name

    
    def exists(self, name):
        name = f"/{name}"
        try:
            self.dbx.files_get_metadata(name)
        except ApiError as e:
            if hasattr(e.error, 'is_path')\
                    and e.error.is_path()\
                    and e.error.get_path().is_not_found():
                # not found
                return False
            # error
            raise e
        # found
        return True


    def url(self, name):
        full_url =  f"https://www.dropbox.com/s/{name}"
        return full_url

