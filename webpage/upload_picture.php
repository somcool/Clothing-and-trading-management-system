<?php
// if(isset($_POST["submit"])) {
    if(!empty($_FILES['image'])) {


        $file = $_FILES['image']['tmp_name'];
        $sourceProperties = getimagesize($file);
        $fileNewName = time();
        $folderPath = "../images/profile/";
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageType = $sourceProperties[2];
        switch ($imageType) {
            case IMAGETYPE_PNG:
                $imageResourceId = imagecreatefrompng($file);
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                imagepng($targetLayer,$folderPath. $fileNewName. "_thump.". $ext);
                break;


            case IMAGETYPE_GIF:
                $imageResourceId = imagecreatefromgif($file);
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                imagegif($targetLayer,$folderPath. $fileNewName. "_thump.". $ext);
                break;


            case IMAGETYPE_JPEG:
                $imageResourceId = imagecreatefromjpeg($file);
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                imagejpeg($targetLayer,$folderPath. $fileNewName. "_thump.". $ext);
                break;


            default:
                echo "Invalid Image type.";
                exit;
                break;
        }
        // move_uploaded_file($file, $folderPath. $fileNewName. ".". $ext);
        // echo "upload Image and Resize Successfully.;
        echo $fileNewName. "_thump.". $ext;
    }
// }


function imageResize($imageResourceId,$width,$height) {


    $targetWidth = 400;
    $targetHeight = 400;


    $targetLayer=imagecreatetruecolor($targetWidth,$targetHeight);
    imagecopyresampled($targetLayer,$imageResourceId,0,0,0,0,$targetWidth,$targetHeight, $width,$height);


    return $targetLayer;
}
?>
