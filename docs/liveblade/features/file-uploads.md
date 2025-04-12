# File uploads

Liveblade offers powerful support for uploading files within your components.

First make your component inherit from `liveblade.FileUploader` mixin. Once this mixin has been added to your component, you can use `b-model` on file inputs as if they were any other input type and Liveblade will take care of the rest.

Here's an example of a simple component that handles uploading a photo:

```python
from pathlib import Path
from django.conf import settings
from pyblade.liveblade import Component, FileUploader
from .forms import ImageUploadForm

class UploadPhoto(Component, FileUploader):

    photo = None,

    def upload(self):
        self.validate({"photo": "image:max:1024"})

        save_path = Path(settings.MEDIA_ROOT) / self.photo.name

        with open(save_path, 'wb+') as f:
            for chunk in photo.chunks():
                f.write(chunk)

        image_url = settings.MEDIA_URL + self.photo.name
```


```blade
<form b-submit="save">
    <input type="file" b-model="photo">

    @error('photo') <span class="error">{{ message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

From the developer's perspective, handling file inputs is no different than handling any other input type: Add `b-model` to the `<input>` tag and everything else is taken care of for you.

However, more is happening under the hood to make file uploads work in Liveblade. Here's a glimpse at what goes on when a user selects a file to upload:

1. When a new file is selected, Liveblade's JavaScript makes an initial request to the component on the server to get a temporary "signed" upload URL.
2. Once the URL is received, JavaScript does the actual "upload" to the signed URL, storing the upload in a temporary directory designated by Liveblade and returning the new temporary file's unique hash ID.
3. Once the file is uploaded and the unique hash ID is generated, Liveblade's JavaScript makes a final request to the component on the server, telling it to "set" the desired public property to the new temporary file.
4. Now, the public property (in this case, `photo`) is set to the temporary file upload and is ready to be stored or validated at any point.

## Storing uploaded files

The previous example demonstrates the most basic storage scenario: moving the temporarily uploaded file to the "photos" directory on the application's default filesystem folder.

However, you may want to customize the file name of the stored file or even specify a specific storage "disk" to keep the file on (such as S3).

> [!tip] Original file names
> You can access the original file name of a temporary upload, by calling its `.get_client_original_name()` method.


## Handling multiple files

Liveblade automatically handles multiple file uploads by detecting the `multiple` attribute on the `<input>` tag.

For example, below is a component with an array property named `photos`. By adding `multiple` to the form's file input, Liveblade will automatically append new files to this array:

```python
from pyblade.liveblade import Component, FileUploader

class UploadPhotos(Component, FileUploader):

    photos = []

    def upload(self):
        self.validate({"photos.*": "image:max:1024"})

        for photo in self.photos:
            ...
```

```blade
<form b-submit="save">
    <input type="file" b-model="photos" multiple>

    @error('photos.*') <span class="error">{{ message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

## File validation

Like we've discussed, validating file uploads with Liveblade is the same as handling file uploads from a standard Form.

## Temporary preview URLs

After a user chooses a file, you should typically show them a preview of that file before they submit the form and store the file.

Liveblade makes this trivial by using the `temporary_url()` method on uploaded files.

> [!info] Temporary URLs are restricted to images
> For security reasons, temporary preview URLs are only supported on files with image MIME types.

Let's explore an example of a file upload with an image preview:

```python
from pyblade.liveblade import Component, FileUploader

class UploadPhotos(Component, FileUploader):

    @validators('image|max:1024')
    def photo(self): pass
        ...
```

```blade
<form b-submit="save">
    @if (photo) <!-- [!code highlight:2] -->
        <img src="{{ photo.temporary_url() }}">
    @endif

    <input type="file" b-model="photo">

    @error('photo') <span class="error">{{ message }}</span> @enderror

    <button type="submit">Save photo</button>
</form>
```

As previously discussed, Liveblade stores temporary files in a non-public directory; therefore, typically there's no simple way to expose a temporary, public URL to your users for image previewing.

However, Liveblade solves this issue by providing a temporary, signed URL that pretends to be the uploaded image so your page can show an image preview to your users.

This URL is protected against showing files in directories above the temporary directory. And, because it's signed, users can't abuse this URL to preview other files on your system.

> [!tip] S3 temporary signed URLs
> If you've configured Liveblade to use S3 for temporary file storage, calling `.temporary_url()` will generate a temporary, signed URL to S3 directly so that image previews aren't loaded from your application server.

## Progress indicators

Every Liveblade file upload operation dispatches JavaScript events on the corresponding `<input>` element, allowing custom JavaScript to intercept the events:

Event | Description
--- | ---
`liveblade-upload-start` | Dispatched when the upload starts
`liveblade-upload-finish` | Dispatched if the upload is successfully finished
`liveblade-upload-cancel` | Dispatched if the upload was cancelled prematurely
`liveblade-upload-error` | Dispatched if the upload fails
`liveblade-upload-progress` | An event containing the upload progress percentage as the upload progresses

## Cancelling an upload

If an upload is taking a long time, a user may want to cancel it. You can provide this functionality with Liveblade's `cancel_upload()` method.

Here's an example of creating a "Cancel Upload" button in a Liveblade component using `b-click` to handle the click event:

```blade
<form b-submit="save">
    <!-- File Input -->
    <input type="file" b-model="photo">

    <!-- Cancel upload button -->
    <button type="button" b-click="cancel_upload('photo')">Cancel Upload</button>

    <!-- ... -->
</form>
```

When "Cancel Upload" is pressed, the file upload request will be aborted and the file input will be cleared. The user can now attempt another upload with a different file.


## Configuration

Because Liveblade stores all file uploads temporarily before the developer can validate or store them, it assumes some default handling behavior for all file uploads.

### Global validation

By default, Liveblade will validate all temporary file uploads with the following validation rules: `file|max:12288` (Must be a file less than 12MB).

If you wish to customize these rules, you can do so inside your PyBlade's configuration (`pyblade.json`) file:

```json
"liveblade":{
    "enabled": true,
    "temporary_file_upload": { // [!code highlight:2]
        "validators": "file|mimes:png,jpg,pdf|max:102400", // (100MB max, and only accept PNGs, JPEGs, and PDFs)
    }
}
```

### Temporary upload directory

Temporary files are uploaded to the specified disk's `liveblade-tmp/` directory. You can customize this directory via the following configuration option:

```json
"liveblade":{
    "enabled": true,
    "temporary_file_upload": { 
        "directory": "tmp" // [!code highlight]
    }
}
```
